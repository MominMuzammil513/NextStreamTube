export async function fetcher(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Send cookies with the request
      });
  
      if (response.status === 401) {
        // If access token expired, try to refresh the token
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });
  
        if (refreshResponse.status === 200) {
          // Tokens refreshed, retry the original request
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        } else {
          // Handle refresh token failure (e.g., logout user)
          console.log('Refresh token failed. Logging out...');
          return null;
        }
      }
  
      return response.json();
    } catch (error) {
      console.error('Fetch failed:', error);
      return null;
    }
  }
  