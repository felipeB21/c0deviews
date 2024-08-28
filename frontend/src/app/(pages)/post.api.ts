interface SlugParams {
  slug: string;
}

export async function createPost(post: any) {
  try {
    const res = await fetch("http://localhost:4000/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, data };
    } else {
      return {
        success: false,
        error: data.error || data.msg || "An error occurred",
        details: data.details || [],
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getPosts() {
  try {
    const res = await fetch("http://localhost:4000/post/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: "No data" };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getPostSlug(params: SlugParams) {
  const { slug } = params;
  try {
    const res = await fetch(`http://localhost:4000/post/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (!data) {
      return { success: false, error: "Post not found" };
    }

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false, error: "An error occurred" };
  }
}

export async function deletePost(params: SlugParams) {
  const { slug } = params;

  try {
    const res = await fetch(`http://localhost:4000/post/delete/${slug}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      return { success: true, msg: data.message };
    } else {
      return { success: false, msg: data.message || "An error occurred" };
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, msg: "An error occurred while deleting the post" };
  }
}
