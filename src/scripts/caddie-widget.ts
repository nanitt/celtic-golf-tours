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
      { label: 'Help me decide', value: 'all', icon: '🌍' }
    ]
  },
  {
    message: "Last one—who's coming, and how much do you want to organise?",
    options: [
      { label: 'A group of mates', value: 'buddy', icon: '⛳' },
      { label: "Just don't make me plan it", value: 'concierge', icon: '🗝️' },
      { label: 'Still working that out', value: 'mixed', icon: '🎲' }
    ]
  }
];

// Response templates based on preferences
//
// These must not name products or partners. An earlier version recommended
// "The St Andrews Pilgrimage" and "Wild Atlantic Links" (both departed in 2025
// and since removed from the site), a "Celtic Classic" that never existed in
// any data, a private tasting at a named distillery, and courses that appear
// nowhere else on the site. The widget renders on every page, so it was
// offering trips the rest of the site had stopped selling.
//
// Rule: reference destinations and courses the site already names, describe
// what a trip could include rather than promising specifics, and hand off to
// a human. Nothing here should be a commitment only Terry can make.
const getRecommendation = (prefs: CaddieState['userPreferences']): string => {
  const { handicap, whiskey, destination, travelStyle } = prefs;

  let rec = "Right then! Based on what you've told me, ";

  // Regions, not courses. Which regions we sell is settled; which tee times we
  // can secure is not, so the widget names places and leaves the rest to Terry.
  if (destination === 'scotland') {
    rec += "I'd build your trip around Scotland. ";
    if (handicap === 'low') {
      rec += "East Lothian would test you properly — Muirfield, North Berwick and Gullane sit within a few miles of each other. ";
    } else if (handicap === 'casual') {
      rec += "Northern Scotland is the one for the scenery: Dornoch, Cruden Bay and Machrihanish Dunes, with room to enjoy the walk. ";
    } else {
      rec += "Northern Scotland and East Lothian together make a good week — the empty north, then the run of links east of Edinburgh. ";
    }
  } else if (destination === 'ireland') {
    rec += "Ireland it is. ";
    if (handicap === 'casual') {
      rec += "I'd start around Dublin, where the links are twenty minutes out and the evenings are in the city. ";
    } else {
      rec += "Northern Ireland for the big dunes, and the northwest — Sligo and Mayo — if you want courses you'll have largely to yourselves. ";
    }
    if (whiskey === 'neat') {
      rec += "We can look at working a distillery visit into a rest day. ";
    }
  } else {
    rec += "I'd look at Scotland and Ireland together — a longer trip, but you only cross once. ";
  }

  // Route to the right product page rather than describing a "travel style".
  if (travelStyle === 'buddy') {
    rec += "That sounds like a Buddy Trip: you pick who's coming, we take the organising off you.";
  } else if (travelStyle === 'concierge') {
    rec += "That's a Concierge Trip — we plan everything, and you don't have to do a thing.";
  } else {
    rec += "Whether that's a Buddy Trip or a fully managed Concierge Trip is worth a conversation.";
  }

  // Terry's planning window. The single most useful thing to say to someone
  // who is only thinking about it.
  rec += "\n\nOne thing worth knowing: the popular weeks are held around 18 months ahead, so if a particular season matters, the call wants to happen early.";

  rec += "\n\nNothing's fixed yet — tell us your dates and we'll put a real itinerary together. Shall I point you to the enquiry form?";

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
    toggleButton?.setAttribute('aria-label', state.isOpen ? 'Close digital caddie chat' : 'Open digital caddie chat');
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
    const container = document.createElement('div');
    container.className = 'options-container';

    message.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.optionValue = opt.value;
      btn.type = 'button';

      if (opt.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'option-icon';
        iconSpan.textContent = opt.icon;
        btn.appendChild(iconSpan);
      }

      const labelSpan = document.createElement('span');
      labelSpan.className = 'option-label';
      labelSpan.textContent = opt.label;
      btn.appendChild(labelSpan);

      btn.addEventListener('click', () => {
        if (opt.value === 'contact') {
          window.location.href = '/contact';
        } else if (opt.value === 'restart') {
          resetConversation();
        } else {
          selectOption(opt.value);
        }
      });

      container.appendChild(btn);
    });

    el.appendChild(container);
  } else {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    message.content.split('\n').forEach(line => {
      const p = document.createElement('p');
      // Escape HTML entities, then apply markdown bold
      const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      p.innerHTML = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      bubble.appendChild(p);
    });

    el.appendChild(bubble);
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
