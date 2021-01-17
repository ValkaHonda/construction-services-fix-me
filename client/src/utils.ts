export const saveClientToken = (token: any) => localStorage.setItem('client', JSON.stringify(token))
export const getClientToken = () => JSON.parse(localStorage.getItem('client') || '') 