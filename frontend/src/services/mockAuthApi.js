// Mock authentication for development testing
// Remove this file once backend MongoDB is configured

const mockUsers = {
  "admin@leetquest.com": {
    token: "mock_admin_token_12345",
    user: {
      id: "1",
      username: "admin",
      email: "admin@leetquest.com",
      isAdmin: true,
      xp: 2500,
      level: 15,
      streak: 25,
      badges: ["streak_master", "xp_champion"],
      createdAt: new Date(),
    },
  },
  "test@leetquest.com": {
    token: "mock_user_token_12345",
    user: {
      id: "2",
      username: "testuser",
      email: "test@leetquest.com",
      isAdmin: false,
      xp: 1250,
      level: 8,
      streak: 12,
      badges: ["beginner"],
      createdAt: new Date(),
    },
  },
};

export const mockRegisterUser = (payload) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, username, password } = payload;

      // Check if user already exists
      if (mockUsers[email]) {
        reject({
          response: {
            data: { message: "User already exists" },
            status: 400,
          },
        });
        return;
      }

      // Create new mock user
      const newUser = {
        token: `mock_token_${Date.now()}`,
        user: {
          id: Math.random().toString(36).substr(2, 9),
          username,
          email,
          isAdmin: false,
          xp: 0,
          level: 1,
          streak: 0,
          badges: [],
          createdAt: new Date(),
        },
      };

      mockUsers[email] = newUser;

      // Return flattened response
      resolve({
        data: {
          token: newUser.token,
          id: newUser.user.id,
          username: newUser.user.username,
          email: newUser.user.email,
          isAdmin: newUser.user.isAdmin,
          xp: newUser.user.xp,
          level: newUser.user.level,
          streak: newUser.user.streak,
          badges: newUser.user.badges,
          createdAt: newUser.user.createdAt,
        },
      });
    }, 500); // Simulate network delay
  });
};

export const mockLoginUser = (payload) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password } = payload;

      // Check credentials
      if (mockUsers[email]) {
        const userData = mockUsers[email];
        // For demo, any password works for test users
        // Return flattened response with all user fields at top level
        resolve({
          data: {
            token: userData.token,
            id: userData.user.id,
            username: userData.user.username,
            email: userData.user.email,
            isAdmin: userData.user.isAdmin,
            xp: userData.user.xp,
            level: userData.user.level,
            streak: userData.user.streak,
            badges: userData.user.badges,
            createdAt: userData.user.createdAt,
          },
        });
      } else {
        reject({
          response: {
            data: { message: "Invalid email or password" },
            status: 401,
          },
        });
      }
    }, 500); // Simulate network delay
  });
};

export const mockGetProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem("authToken");

      // Find user by token
      for (const userData of Object.values(mockUsers)) {
        if (userData.token === token) {
          resolve({ data: userData.user });
          return;
        }
      }

      resolve({ data: null });
    }, 300);
  });
};
