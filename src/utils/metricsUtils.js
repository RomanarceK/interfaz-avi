export function groupMessagesByDay(conversations) {
  const dayData = {};

  conversations.forEach((conv) => {
    conv.content.forEach((msg) => {
      let timestamp;
      if (typeof msg === 'string') {
        const timestampMatch = msg.match(/timestamp: (.+)/);
        timestamp = timestampMatch ? new Date(timestampMatch[1]) : new Date();
      } else {
        timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
      }

      const day = timestamp.toISOString().split('T')[0];

      if (!dayData[day]) {
        dayData[day] = { day, total: 0, assistant: 0, user: 0 };
      }

      const role = typeof msg === 'string' ? msg.match(/role: ([^,]+)/)?.[1] || 'unknown' : msg.role || 'unknown';

      dayData[day].total += 1;
      if (role === 'assistant') {
        dayData[day].assistant += 1;
      } else {
        dayData[day].user += 1;
      }
    });
  });

  return Object.values(dayData).sort((a, b) => new Date(a.day) - new Date(b.day));
}

export function groupConversationsByDay(conversations) {
  const dayData = {};

  conversations.forEach((conv) => {
    const createdDate = new Date(conv.created_at);
    const day = createdDate.toISOString().split('T')[0];

    if (!dayData[day]) {
      dayData[day] = { day, count: 0 };
    }
    dayData[day].count += 1;
  });

  return Object.values(dayData).sort((a, b) => new Date(a.day) - new Date(b.day));
}

export function groupNewUsersByDay(conversations) {
  const userEarliestDay = {};

  conversations.forEach((conv) => {
    const createdDate = new Date(conv.created_at);
    const day = createdDate.toISOString().split('T')[0];
    const userId = conv.userId;

    if (!userEarliestDay[userId]) {
      userEarliestDay[userId] = day;
    } else {
      if (day < userEarliestDay[userId]) {
        userEarliestDay[userId] = day;
      }
    }
  });

  const dayData = {};
  Object.values(userEarliestDay).forEach((earliestDay) => {
    if (!dayData[earliestDay]) {
      dayData[earliestDay] = { day: earliestDay, count: 0 };
    }
    dayData[earliestDay].count += 1;
  });

  return Object.values(dayData).sort((a, b) => new Date(a.day) - new Date(b.day));
}

export function groupActiveConversationsByDay(conversations) {
  const dayData = {};

  conversations.forEach(conv => {
    const activeDays = new Set();
    conv.content.forEach(msg => {
      let timestamp, role;
      if (typeof msg === 'string') {
        const timestampMatch = msg.match(/timestamp: (.+)/);
        timestamp = timestampMatch ? new Date(timestampMatch[1]) : new Date();
        role = msg.match(/role: ([^,]+)/)?.[1] || 'unknown';
      } else {
        timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
        role = msg.role || 'unknown';
      }

      if (role === 'assistant') {
        const day = timestamp.toISOString().split('T')[0];
        activeDays.add(day);
      }
    });

    activeDays.forEach(day => {
      if (!dayData[day]) {
        dayData[day] = { day, count: 0 };
      }
      dayData[day].count += 1;
    });
  });

  return Object.values(dayData).sort((a, b) => new Date(a.day) - new Date(b.day));
}