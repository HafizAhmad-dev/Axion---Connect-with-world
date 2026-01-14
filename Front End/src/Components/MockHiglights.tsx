  interface Status {
  id: string;
  content: string;
  timestamp: string;
  backgroundColor: string;
}

 interface Highlight {
  id: string;
  user: string;
  avatar: string;
  seen: boolean;
  time: string;
  statuses: Status[];
}

// For the full object with dynamic keys
 type HighlightsDataType = Record<string, Highlight>;

 const HighlightsData:HighlightsDataType = {
    '1': {
      id: '1',
      user: 'Sarah Chen',
      seen:false,
      avatar: 'SC',
      time: '2 hours ago',
      statuses: [
        {
          id: 's1',
          content: '✨ Just finished an amazing project with the team! Feeling grateful! 🎉',
          timestamp: '2 hours ago',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
          id: 's2',
          content: 'The future belongs to those who believe in the beauty of their dreams 💫',
          timestamp: '3 hours ago',
          backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
          id: 's3',
          content: 'Coffee and creativity - the perfect combination! ☕️',
          timestamp: '4 hours ago',
          backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
      ],
    },
    '2': {
      id: '2',
      user: 'Marcus Rodriguez',
      avatar: 'MR',
      seen:false,

      time: '5 hours ago',
      statuses: [
        {
          id: 's4',
          content: 'Beautiful sunset today 🌅 Taking a moment to appreciate the little things',
          timestamp: '5 hours ago',
          backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        },
        {
          id: 's5',
          content: 'Life is short, make every moment count! 💪',
          timestamp: '6 hours ago',
          backgroundColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        },
      ],
    },
    '3': {
      id: '3',
      user: 'Emily Watson',
      avatar: 'EW',
      seen:false,

      time: '8 hours ago',
      statuses: [
        {
          id: 's6',
          content: 'Working hard on something amazing! Stay tuned 🚀',
          timestamp: '8 hours ago',
          backgroundColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        },
      ],
    },
    '4': {
      id: '4',
      user: 'David Kim',
      avatar: 'DK',
      seen:true,
      time: 'Yesterday',
      statuses: [
        {
          id: 's7',
          content: 'Great day at the beach! 🏖️',
          timestamp: 'Yesterday at 3:45 PM',
          backgroundColor: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
        },
        {
          id: 's8',
          content: 'Sunset vibes 🌅',
          timestamp: 'Yesterday at 7:20 PM',
          backgroundColor: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
        },
        {
          id: 's9',
          content: 'Perfect end to a perfect day ✨',
          timestamp: 'Yesterday at 9:15 PM',
          backgroundColor: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
        },
        {
          id: 's10',
          content: 'Grateful for moments like these 🙏',
          timestamp: 'Yesterday at 10:00 PM',
          backgroundColor: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
        },
      ],
    },
    '5': {
      id: '5',
      user: 'Lisa Anderson',
      avatar: 'LA',
      seen:true,
      time: 'Yesterday',
      statuses: [
        {
          id: 's11',
          content: 'New adventures await! 🌟',
          timestamp: 'Yesterday at 11:30 AM',
          backgroundColor: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        },
        {
          id: 's12',
          content: 'Making memories that will last forever 📸',
          timestamp: 'Yesterday at 2:15 PM',
          backgroundColor: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        },
      ],
    },
    '6': {
      id: '6',
      user: 'James Taylor',
      avatar: 'JT',
      seen:true,
      time: 'Yesterday',
      statuses: [
        {
          id: 's13',
          content: 'Chase your dreams, not your fears! 💭',
          timestamp: 'Yesterday at 5:00 PM',
          backgroundColor: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        },
      ],
    },
  };

export default HighlightsData