/**
 * Digital Caddie Widget
 * Chat-style interaction for tour recommendations
 *
 * This is a static/demo implementation. For production,
 * connect to an AI backend or structured decision tree.
 */

interface CaddieMessage {
  id: string;
  type: 'caddie' | 'user' | 'options';
  content: string;
  options?: CaddieOption[];
  timestamp: Date;
}

interface CaddieOption {
  label: string;
  value: string;
  icon?: string;
}

interface CaddieState {
  isOpen: boolean;
  messages: CaddieMessage[];
  conversationStep: number;
  userPreferences: {
    handicap?: string;
    whiskey?: string;
    destination?: string;
    travelStyle?: string;
  };
}

// Conversation flow
const CONVERSATION_STEPS = [
  {
    message: "Ah, welcome! I'm Seamus, your digital caddie. Before we tee off on planning, tell me—what's your handicap?",
    options: [
      { label: 'Single digits', value: 'low', icon: '🏆' },
      { label: '10-18', value: 'mid', icon: '⛳' },
      { label: '18+', value: 'high', icon: '🌱' },
      { label: 'Just here for the views', value: 'casual', icon: '🏔️' }
    ]
  },
  {
    message: "And how do you like your whiskey?",
    options: [
      { label: 'Neat, no fuss', value: 'neat', icon: '🥃' },
      { label: 'A wee drop of water', value: 'water', icon: '💧' },
      { label: "I'm more of a pint person", value: 'beer', icon: '🍺' },
      { label: 'Surprise me', value: 'surprise', icon: '✨' }
    ]
  },
  {
    message: "Brilliant! Now, where does your heart yearn to play?",
    options: [
      { label: 'Scotland - Home of Golf', value: 'scotland', icon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
      { label: 'Ireland - Wild Atlantic', value: 'ireland', icon: '🇮🇪' },
      { label: 'Wales - Hidden Gems', value: 'wales', icon: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
      { label: 'Show me everything', value: 'all', icon: '🌍' }
    ]
  },
  {
    message: "Last question—what's your travel style?",
    options: [
      { label: 'Luxury all the way', value: 'luxury', icon: '👑' },
      { label: 'Authentic & local', value: 'authentic', icon: '🏠' },
      { label: 'Best value', value: 'value', icon: '💎' },
      { label: 'Mix it up', value: 'mixed', icon: '🎲' }
    ]
  }
];

// Response templates based on preferences
const getRecommendation = (prefs: CaddieState['userPreferences']): string => {
  const { handicap, whiskey, destination, travelStyle } = prefs;

  let rec = "Right then! Based on what you've told me, I'd recommend ";

  // Destination specific
  if (destination === 'scotland') {
    rec += "starting with **The St Andrews Pilgrimage**. ";
    if (handicap === 'low') {
      rec += "With your game, you'll want to tackle the Old Course and Kingsbarns. ";
    } else if (handicap === 'casual') {
      rec += "The Castle Course offers stunning views without the pressure. ";
    }
  } else if (destination === 'ireland') {
    rec += "our **Wild Atlantic Links** tour. Ballybunion and Lahinch are calling! ";
    if (whiskey === 'neat') {
      rec += "We'll arrange a private tasting at Dingle Distillery. ";
    }
  } else if (destination === 'wales') {
    rec += "the **Welsh Discovery** itinerary. Royal Porthcawl is a hidden masterpiece. ";
  } else {
    rec += "our **Grand British Isles Tour**—hit the highlights of all four nations. ";
  }

  // Travel style
  if (travelStyle === 'luxury') {
    rec += "We'll book you into the finest manor houses and arrange chauffeur transfers.";
  } else if (travelStyle === 'authentic') {
    rec += "You'll stay in characterful B&Bs and dine where the locals do.";
  } else {
    rec += "We'll find the perfect balance of comfort and character.";
  }

  rec += "\n\nShall I connect you with our team to start planning?";

  return rec;
};

// Widget state
let state: CaddieState = {
  isOpen: false,
  messages: [],
  conversationStep: -1,
  userPreferences: {}
};

// DOM elements
let widget: HTMLElement | null = null;
let messagesContainer: HTMLElement | null = null;
let toggleButton: HTMLElement | null = null;

/**
 * Initialize the widget
 */
export function initCaddieWidget(containerSelector: string): void {
  widget = document.querySelector(containerSelector);
  if (!widget) return;

  messagesContainer = widget.querySelector('[data-caddie-messages]');
  toggleButton = widget.querySelector('[data-caddie-toggle]');

  if (!messagesContainer || !toggleButton) return;

  // Toggle handler
  toggleButton.addEventListener('click', toggleWidget);

}

/**
 * Toggle widget open/closed
 */
export function toggleWidget(): void {
  state.isOpen = !state.isOpen;

  if (widget) {
    widget.classList.toggle('is-open', state.isOpen);
    toggleButton?.setAttribute('aria-expanded', String(state.isOpen));
  }

  // Start conversation on first open
  if (state.isOpen && state.messages.length === 0) {
    startConversation();
  }
}

/**
 * Start the conversation flow
 */
function startConversation(): void {
  state.conversationStep = 0;
  const step = CONVERSATION_STEPS[0];

  addMessage({
    id: generateId(),
    type: 'caddie',
    content: step.message,
    timestamp: new Date()
  });

  // Show options after a brief delay
  setTimeout(() => {
    addMessage({
      id: generateId(),
      type: 'options',
      content: '',
      options: step.options,
      timestamp: new Date()
    });
  }, 800);
}

/**
 * Handle option selection
 */
export function selectOption(value: string): void {
  const currentStep = CONVERSATION_STEPS[state.conversationStep];
  const selectedOption = currentStep?.options?.find(o => o.value === value);

  if (!selectedOption) return;

  // Store preference
  const prefKeys = ['handicap', 'whiskey', 'destination', 'travelStyle'];
  const prefKey = prefKeys[state.conversationStep] as keyof CaddieState['userPreferences'];
  state.userPreferences[prefKey] = value;

  // Add user response
  addMessage({
    id: generateId(),
    type: 'user',
    content: `${selectedOption.icon || ''} ${selectedOption.label}`,
    timestamp: new Date()
  });

  // Remove options
  removeOptions();

  // Next step or recommendation
  state.conversationStep++;

  if (state.conversationStep < CONVERSATION_STEPS.length) {
    // Next question
    setTimeout(() => {
      const nextStep = CONVERSATION_STEPS[state.conversationStep];
      addMessage({
        id: generateId(),
        type: 'caddie',
        content: nextStep.message,
        timestamp: new Date()
      });

      setTimeout(() => {
        addMessage({
          id: generateId(),
          type: 'options',
          content: '',
          options: nextStep.options,
          timestamp: new Date()
        });
      }, 600);
    }, 500);
  } else {
    // Final recommendation
    setTimeout(() => {
      const recommendation = getRecommendation(state.userPreferences);
      addMessage({
        id: generateId(),
        type: 'caddie',
        content: recommendation,
        timestamp: new Date()
      });

      // Add contact CTA
      setTimeout(() => {
        addMessage({
          id: generateId(),
          type: 'options',
          content: '',
          options: [
            { label: 'Yes, contact me!', value: 'contact', icon: '📞' },
            { label: 'Start over', value: 'restart', icon: '🔄' }
          ],
          timestamp: new Date()
        });
      }, 800);
    }, 500);
  }
}

/**
 * Add a message to the chat
 */
function addMessage(message: CaddieMessage): void {
  state.messages.push(message);
  renderMessage(message);
  scrollToBottom();
}

/**
 * Render a message in the DOM
 */
function renderMessage(message: CaddieMessage): void {
  if (!messagesContainer) return;

  const el = document.createElement('div');
  el.className = `caddie-message caddie-message-${message.type}`;
  el.setAttribute('data-message-id', message.id);

  if (message.type === 'options' && message.options) {
    el.innerHTML = `
      <div class="options-container">
        ${message.options.map(opt => `
          <button
            class="option-btn"
            data-option-value="${opt.value}"
            type="button"
          >
            ${opt.icon ? `<span class="option-icon">${opt.icon}</span>` : ''}
            <span class="option-label">${opt.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Attach click handlers
    el.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = (e.currentTarget as HTMLElement).dataset.optionValue;
        if (value === 'contact') {
          window.location.href = '/contact';
        } else if (value === 'restart') {
          resetConversation();
        } else if (value) {
          selectOption(value);
        }
      });
    });
  } else {
    // Parse markdown-style bold
    const content = message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    el.innerHTML = `
      <div class="message-bubble">
        ${content.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
    `;
  }

  messagesContainer.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.classList.add('is-visible');
  });
}

/**
 * Remove options from DOM
 */
function removeOptions(): void {
  if (!messagesContainer) return;

  const optionsMessages = messagesContainer.querySelectorAll('.caddie-message-options');
  optionsMessages.forEach(el => el.remove());

  // Also remove from state
  state.messages = state.messages.filter(m => m.type !== 'options');
}

/**
 * Reset conversation
 */
function resetConversation(): void {
  state.messages = [];
  state.conversationStep = -1;
  state.userPreferences = {};

  if (messagesContainer) {
    messagesContainer.innerHTML = '';
  }

  startConversation();
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom(): void {
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if widget is open
 */
export function isWidgetOpen(): boolean {
  return state.isOpen;
}

/**
 * Open widget programmatically
 */
export function openWidget(): void {
  if (!state.isOpen) {
    toggleWidget();
  }
}

/**
 * Close widget programmatically
 */
export function closeWidget(): void {
  if (state.isOpen) {
    toggleWidget();
  }
}
