// 検索機能の実装

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const buttonsGrid = document.getElementById('buttonsGrid');
    const noResults = document.getElementById('noResults');
    
    if (!searchInput) return;
    
    // デバウンス付き検索
    function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
const debouncedSearch = debounce(performSearch, 300);

    
    searchInput.addEventListener('input', function(e) {
        debouncedSearch(e.target.value);
    });
    
    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const cards = document.querySelectorAll('.procedure-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            const keywords = card.dataset.keywords ? card.dataset.keywords.toLowerCase() : '';
            
            const isVisible = term === '' || 
                             title.includes(term) || 
                             description.includes(term) || 
                             keywords.includes(term);
            
            if (isVisible) {
                card.parentElement.style.display = 'block';
                highlightSearchTerm(card, term);
                visibleCount++;
            } else {
                card.parentElement.style.display = 'none';
            }
        });
        
        // 検索結果の表示制御
        if (noResults) {
            noResults.style.display = (visibleCount === 0 && term !== '') ? 'block' : 'none';
        }
        
        // 検索統計の表示
        updateSearchStats(visibleCount, term);
    }
    
    function highlightSearchTerm(card, term) {
        if (!term) {
            // ハイライトをクリア
            const highlighted = card.querySelectorAll('.highlight');
            highlighted.forEach(el => {
                el.outerHTML = el.textContent;
            });
            return;
        }
        
        const title = card.querySelector('.card-title');
        const description = card.querySelector('.card-description');
        
        [title, description].forEach(element => {
            let html = element.textContent;
            const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
            html = html.replace(regex, '<mark class="highlight">$1</mark>');
            element.innerHTML = html;
        });
    }
    
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function updateSearchStats(count, term) {
        let statsElement = document.getElementById('searchStats');
        
        if (!statsElement) {
            statsElement = document.createElement('div');
            statsElement.id = 'searchStats';
            statsElement.style.cssText = `
                text-align: center;
                margin: 20px 0;
                color: #718096;
                font-size: 0.9rem;
            `;
            searchInput.parentElement.insertAdjacentElement('afterend', statsElement);
        }
        
        if (term && count > 0) {
            statsElement.textContent = `"${term}" の検索結果: ${count}件`;
            statsElement.style.display = 'block';
        } else {
            statsElement.style.display = 'none';
        }
    }
    
    // 検索履歴機能
    function saveSearchHistory(term) {
        if (!term || term.length < 2) return;
        
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history = history.filter(item => item !== term); // 重複削除
        history.unshift(term); // 先頭に追加
        history = history.slice(0, 5); // 最大5件まで
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateSearchSuggestions(history);
    }
    
    function updateSearchSuggestions(history) {
        let suggestionsElement = document.getElementById('searchSuggestions');
        
        if (!suggestionsElement) {
            suggestionsElement = document.createElement('div');
            suggestionsElement.id = 'searchSuggestions';
            suggestionsElement.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 2px solid #e2e8f0;
                border-top: none;
                border-radius: 0 0 10px 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                display: none;
            `;
            searchInput.parentElement.appendChild(suggestionsElement);
        }
        
        if (history.length === 0) {
            suggestionsElement.style.display = 'none';
            return;
        }
        
        const html = history.map(term => `
            <div class="suggestion-item" data-term="${term}" style="
                padding: 10px 20px;
                cursor: pointer;
                border-bottom: 1px solid #f1f5f9;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='#f7fafc'" 
               onmouseout="this.style.backgroundColor='white'">
                <i class="fas fa-history" style="color: #a0aec0; margin-right: 10px;"></i>
                ${term}
            </div>
        `).join('');
        
        suggestionsElement.innerHTML = html;
        
        // 提案クリックイベント
        suggestionsElement.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const term = this.dataset.term;
                searchInput.value = term;
                performSearch(term);
                suggestionsElement.style.display = 'none';
            });
        });
    }
    
    // 検索入力時のイベント
    searchInput.addEventListener('focus', function() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (history.length > 0) {
            updateSearchSuggestions(history);
            document.getElementById('searchSuggestions').style.display = 'block';
        }
    });
    
    searchInput.addEventListener('blur', function(e) {
        // 少し遅延させて、提案クリックを可能にする
        setTimeout(() => {
            const suggestions = document.getElementById('searchSuggestions');
            if (suggestions) {
                suggestions.style.display = 'none';
            }
        }, 200);
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const term = this.value.trim();
            if (term) {
                saveSearchHistory(term);
            }
        }
    });
});

// CSSスタイルを動的に追加
const style = document.createElement('style');
style.textContent = `
    .highlight {
        background-color: #ffd700;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
    }
    
    .search-container {
        position: relative;
    }
`;
document.head.appendChild(style);