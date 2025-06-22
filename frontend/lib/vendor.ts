export async function isVendor(email: string): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:8000/api/vendors/by-user?email=${encodeURIComponent(email)}`);
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.vendor;
  } catch {
    return false;
  }
}
