interface GetUserParams {
  username: string;
}

export async function createUser(user: any) {
  try {
    const res = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: data.msg };
    } else {
      return {
        success: false,
        error: data.error || data.msg || "An error occurred",
        details: data.details || [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "An unexpected error occurred",
      details: [],
    };
  }
}

export async function loginUser(user: any) {
  try {
    const res = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: data.msg };
    } else {
      return {
        success: false,
        error: data.error || data.msg || "An error occurred",
        details: data.details || [],
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getUser() {
  try {
    const res = await fetch("http://localhost:4000/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, user: data };
    } else {
      return {
        success: false,
        error: data.error || "An error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function logoutUser() {
  try {
    const res = await fetch("http://localhost:4000/auth/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, message: data.msg };
    } else {
      return {
        success: false,
        error: data.error || "An error occurred during logout",
      };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during logout",
    };
  }
}

export async function getUserByUsername(params: GetUserParams) {
  try {
    const { username } = params;

    const res = await fetch(`http://localhost:4000/auth/profile/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, user: data };
    } else {
      return { success: false, error: data.msg || "An error occurred" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateUser(updatedUserData: {
  username: string;
  avatar: string | null;
}) {
  try {
    const res = await fetch("http://localhost:4000/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedUserData),
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, user: data, msg: data.msg };
    } else {
      return {
        success: false,
        error: data.msg,
        details: data.details || "An error occurred",
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: "An error occurred" };
  }
}
