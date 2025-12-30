// Parse JWT và trả về payload
export function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)); 
  } 
  catch {
    return null;
  }
}

// Kiểm tra token còn hợp lệ (còn hạn) hay không
export function isTokenValid() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const payload = parseJwt(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 > Date.now(); // exp là timestamp (giây)
}

// Xóa token và redirect về trang login
export function logoutAndRedirect() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Thêm fetch interceptor để tự động gắn token và xử lý token hết hạn / 401
export function initAuthFetchInterceptor() {
  if (typeof window === 'undefined' || !window.fetch) return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const token = localStorage.getItem('token');

    // Nếu token tồn tại, kiểm tra hết hạn
    if (token) {
      const payload = parseJwt(token);
      if (!payload || payload.exp * 1000 <= Date.now()) {
        logoutAndRedirect();
        return Promise.reject(new Error('Token expired'));
      }

      // Thêm header Authorization nếu chưa có
      init.headers = init.headers || {};
      if (!init.headers.Authorization && !init.headers.authorization) {
        init.headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await originalFetch(input, init);

    // Nếu server trả 401/403 → logout
    if ([401, 403].includes(res.status)) {
      logoutAndRedirect();
      return Promise.reject(new Error('Unauthorized'));
    }

    return res;
  };
}

// Xuất default cho tiện import
export default {
  parseJwt,
  isTokenValid,
  logoutAndRedirect,
  initAuthFetchInterceptor,
};