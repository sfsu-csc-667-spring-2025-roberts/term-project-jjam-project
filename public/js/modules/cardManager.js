// Card Manager Module
export class CardManager {
  constructor() {
    this.suits = {
      'H': '♥',
      'D': '♦',
      'C': '♣',
      'S': '♠'
    };
    
    this.ranks = {
      '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
      '8': '8', '9': '9', '10': '10', 'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A'
    };
    
    this.initializeEventListeners();
  }
  
  // Create a card element
  createCard(cardCode) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.card = cardCode;
    
    const rank = cardCode.slice(0, -1);
    const suit = cardCode.slice(-1);
    const suitSymbol = this.suits[suit] || '';
    const suitClass = this.getSuitClass(suit);
    
    card.innerHTML = `
      <div class="card-front">
        <div class="card-rank">${rank}</div>
        <div class="card-suit ${suitClass}">${suitSymbol}</div>
        <div class="card-rank" style="transform: rotate(180deg)">${rank}</div>
      </div>
      <div class="card-back"></div>
    `;
    
    return card;
  }
  
  // Get CSS class for suit
  getSuitClass(suit) {
    switch(suit) {
      case 'H': return 'hearts';
      case 'D': return 'diamonds';
      case 'C': return 'clubs';
      case 'S': return 'spades';
      default: return '';
    }
  }
  
  // Render player's hand
  renderHand(hand, container) {
    if (!container) return;
    
    container.innerHTML = '';
    hand.forEach(cardCode => {
      const card = this.createCard(cardCode);
      container.appendChild(card);
    });
  }
  
  // Initialize event listeners
  initializeEventListeners() {
    // Delegate card click events
    document.addEventListener('click', (e) => {
      const cardElement = e.target.closest('.card');
      if (cardElement) {
        this.handleCardClick(cardElement);
      }
    });
  }
  
  // Handle card click
  handleCardClick(cardElement) {
    // Toggle selected state
    cardElement.classList.toggle('selected');
    
    // Enable/disable play button based on selection
    const playButton = document.getElementById('playCard');
    if (playButton) {
      const anySelected = document.querySelector('.card.selected');
      playButton.disabled = !anySelected;
    }
    
    // Emit event or handle card play
    const cardCode = cardElement.dataset.card;
    console.log('Card clicked:', cardCode);
  }
  
  // Helper: Create a standard 52-card deck
  createDeck() {
    const deck = [];
    const suits = Object.keys(this.suits);
    const ranks = Object.keys(this.ranks);
    
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(rank + suit);
      }
    }
    
    return deck;
  }
  
  // Helper: Shuffle deck
  shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
}
