import fs from 'fs'

const USERS_FILE = 'users.txt';

let adminId:any = null;
let allowedUsers = new Set();

export function initUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '', 'utf8');
  }
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  const lines = data.split('\n').map((l:any) => l.trim());
  if (lines.length > 0 && lines[0] !== '') {
    adminId = lines[0];
  }

  const userLines = lines.slice(1).filter((l:any)  => l !== '');
  allowedUsers = new Set(userLines);
}

export function saveUsers() {
  const adminLine = adminId ? adminId : '';
  const userLines = Array.from(allowedUsers);
  const fileContent = [adminLine, ...userLines].join('\n');
  fs.writeFileSync(USERS_FILE, fileContent, 'utf8');
}

export function getAdmin() {
  return adminId;
}

export function setAdmin(userId:string) {
  adminId = userId;
  saveUsers();
  console.log(`Set admin to user: ${userId}`);
}

export function isAdmin(userId:string) {
  return adminId && adminId === userId;
}

export function isAllowedUser(userId:string) {
  // The admin should inherently have access, but to keep logic consistent:
  if (isAdmin(userId)) return true;
  return allowedUsers.has(userId);
}

export function addAllowedUser(userId:string) {
  // Do not add admin as a duplicate line if they're already admin
  if (isAdmin(userId) || allowedUsers.has(userId)) return;
  allowedUsers.add(userId);
  saveUsers();
}

