export interface Highlight {
   id: string;
  type: "text" | "image";       // type of highlight
  content?: string;             // for text
  imageUrl?: string;             // for image 
  timestamp: string;
  backgroundColor?: string;
}

export interface HighlightDataStructure {
  id: string;
  user: string;
  avatar: string;
  seen: boolean;
  time: string;
  highlight: Highlight[];
}

const HighlightsData: HighlightDataStructure[] = [
  {
    id: 'highlight_sarah',
    user: 'Sarah Chen',
    avatar: 'SC',
    seen: false,
    time: '2 hours ago',
    highlight: [
      {
        type:'text',
        id: 'sarah_1',
        content: '✨ Just finished an amazing project with the team! Feeling grateful! 🎉',
        timestamp: '2 hours ago',
        backgroundColor: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      },
      {
        type:'text',
        id: 'sarah_2',
        content: 'The future belongs to those who believe in the beauty of their dreams 💫',
        timestamp: '3 hours ago',
        backgroundColor: 'bg-gradient-to-br from-pink-400 to-rose-500',
      },
      {
        type:'text',
        id: 'sarah_3',
        content: 'Coffee and creativity - the perfect combination! ☕️',
        timestamp: '4 hours ago',
        backgroundColor: 'bg-gradient-to-br from-sky-400 to-cyan-400',
      },
    ],
  },
  {
    id: 'highlight_marcus',
    user: 'Marcus Rodriguez',
    avatar: 'MR',
    seen: false,
    time: '5 hours ago',
    highlight: [
      {
        type:'text',
        id: 'marcus_1',
        content: 'Beautiful sunset today 🌅 Taking a moment to appreciate the little things',
        timestamp: '5 hours ago',
        backgroundColor: 'bg-gradient-to-br from-pink-500 to-yellow-400',
      },
      {
        id: 'marcus_2',
        content: 'Life is short, make every moment count! 💪',
        type:'text',
        timestamp: '6 hours ago',
        backgroundColor: 'bg-gradient-to-br from-teal-400 to-indigo-900',
      },
    ],
  },
  {
    id: 'highlight_emily',
    user: 'Emily Watson',
    avatar: 'EW',
    seen: false,
    time: '8 hours ago',
    highlight: [
      {
        type:'text',
        id: 'emily_1',
        content: 'Working hard on something amazing! Stay tuned 🚀',
        timestamp: '8 hours ago',
        backgroundColor: 'bg-gradient-to-br from-emerald-200 to-pink-200',
      },
    ],
  },
  {
    id: 'highlight_david',
    user: 'David Kim',
    avatar: 'DK',
    seen: false,
    time: 'Yesterday',
    highlight: [
      {
        type:'text',
        id: 'david_1',
        content: 'Great day at the beach! 🏖️',
        timestamp: 'Yesterday at 3:45 PM',
        backgroundColor: 'bg-gradient-to-br from-sky-900 to-teal-300',
      },
      {
        type:'text',
        id: 'david_2',
        content: 'Sunset vibes 🌅',
        timestamp: 'Yesterday at 7:20 PM',
        backgroundColor: 'bg-gradient-to-br from-rose-300 to-pink-100',
      },
      {
        type:'text',
        id: 'david_3',
        content: 'Perfect end to a perfect day ✨',
        timestamp: 'Yesterday at 9:15 PM',
        backgroundColor: 'bg-gradient-to-br from-neutral-700 to-black',
      },
      {
        type:'text',
        id: 'david_4',
        content: 'Grateful for moments like these 🙏',
        timestamp: 'Yesterday at 10:00 PM',
        backgroundColor: 'bg-gradient-to-br from-rose-500 to-sky-200',
      },
    ],
  },
  {
    id: 'highlight_lisa',
    user: 'Lisa Anderson',
    avatar: 'LA',
    seen: false,
    time: 'Yesterday',
    highlight: [
      {
        type:'text',
        id: 'lisa_1',
        content: 'New adventures await! 🌟',
        timestamp: 'Yesterday at 11:30 AM',
        backgroundColor: 'bg-gradient-to-br from-blue-300 to-sky-200',
      },
      {
        type:'text',
        id: 'lisa_2',
        content: 'Making memories that will last forever 📸',
        timestamp: 'Yesterday at 2:15 PM',
        backgroundColor: 'bg-gradient-to-br from-amber-100 to-orange-300',
      },
    ],
  },
  {
    id: 'highlight_james',
    user: 'James Taylor',
    avatar: 'JT',
    seen: false,
    time: 'Yesterday',
    highlight: [
      {
        type:'text',
        id: 'james_1',
        content: 'Chase your dreams, not your fears! 💭',
        timestamp: 'Yesterday at 5:00 PM',
        backgroundColor: 'bg-gradient-to-br from-purple-300 to-yellow-100',
      },
    ],
  },
];

export default HighlightsData;
