# 🔐 Role-Based Access Control (RBAC) Guide

## 📋 Roles và Permissions

### **Roles:**
- **`user`** - Người dùng thông thường
- **`manager`** - Quản lý 
- **`admin`** - Quản trị viên

### **Permissions:**
```javascript
// User permissions
'profile:read'      // Đọc profile của mình
'profile:update'    // Cập nhật profile của mình

// Manager permissions  
'users:read'        // Xem danh sách users
'users:update'      // Cập nhật thông tin users
'content:manage'    // Quản lý nội dung

// Admin permissions
'users:delete'      // Xóa users
'system:manage'     // Quản lý hệ thống
'roles:manage'      // Quản lý roles và permissions
```

### **Default Permissions by Role:**
```javascript
user: ['profile:read', 'profile:update']

manager: [
  'profile:read', 'profile:update',
  'users:read', 'users:update', 'content:manage'
]

admin: [
  'profile:read', 'profile:update',
  'users:read', 'users:update', 'users:delete',
  'content:manage', 'system:manage', 'roles:manage'
]
```

## 🛡️ Middleware Usage

### **1. Require Role:**
```javascript
const { requireRole, requireAdmin, requireManagerOrAdmin } = require('../middleware/rbac');

// Chỉ admin
router.get('/admin-only', authMiddleware, requireAdmin, controller);

// Manager hoặc Admin
router.get('/manager-area', authMiddleware, requireManagerOrAdmin, controller);

// Specific role
router.get('/specific', authMiddleware, requireRole('manager'), controller);

// Multiple roles
router.get('/multiple', authMiddleware, requireRole('admin', 'manager'), controller);
```

### **2. Require Permission:**
```javascript
const { requirePermission, requireAllPermissions } = require('../middleware/rbac');

// Có ít nhất 1 permission
router.delete('/users/:id', 
  authMiddleware, 
  requirePermission('users:delete', 'system:manage'), 
  controller
);

// Có tất cả permissions
router.post('/admin/system', 
  authMiddleware, 
  requireAllPermissions('system:manage', 'roles:manage'), 
  controller
);
```

### **3. Ownership or Role:**
```javascript
const { requireOwnershipOrRole } = require('../middleware/rbac');

// User chỉ có thể truy cập resource của mình, trừ khi là manager/admin
router.get('/users/:userId/profile', 
  authMiddleware, 
  requireOwnershipOrRole('userId'), 
  controller
);
```

## 🎯 Ví dụ sử dụng trong Routes

### **Admin Routes:**
```javascript
// routes/admin.js
const { requireAdmin } = require('../middleware/rbac');

router.get('/users', authMiddleware, requireAdmin, adminController.getAllUsers);
router.delete('/users/:id', authMiddleware, requireAdmin, adminController.deleteUser);
router.post('/roles', authMiddleware, requireAdmin, adminController.createRole);
```

### **Manager Routes:**
```javascript
// routes/manager.js
const { requireManagerOrAdmin } = require('../middleware/rbac');

router.get('/dashboard', authMiddleware, requireManagerOrAdmin, managerController.getDashboard);
router.put('/users/:id', authMiddleware, requireManagerOrAdmin, managerController.updateUser);
```

### **User Routes with Ownership:**
```javascript
// routes/user.js
const { requireOwnershipOrRole } = require('../middleware/rbac');

router.get('/:userId/profile', authMiddleware, requireOwnershipOrRole('userId'), userController.getProfile);
router.put('/:userId/profile', authMiddleware, requireOwnershipOrRole('userId'), userController.updateProfile);
```

## 🔧 User Model Methods

### **Role Methods:**
```javascript
user.hasRole('admin')           // true/false
user.isAdmin()                  // true/false
user.isManager()               // true/false
user.setRole('manager')        // Set role và default permissions
```

### **Permission Methods:**
```javascript
user.hasPermission('users:read')                    // true/false
user.hasAnyPermission(['users:read', 'users:write']) // true/false
user.hasAllPermissions(['users:read', 'users:write']) // true/false
user.addPermission('new:permission')                // Add permission
user.removePermission('old:permission')             // Remove permission
```

## 📚 Migration Commands cho RBAC

### **Tạo migration mới:**
```bash
npm run migration:create add_new_permissions
npm run migration:create create_roles_table
npm run migration:create update_user_roles
```

### **Ví dụ migration content:**
```javascript
const up = async () => {
  const db = mongoose.connection.db;
  
  // Add new permission to all managers
  await db.collection('users').updateMany(
    { role: 'manager' },
    { $addToSet: { permissions: 'new:permission' } }
  );
  
  // Create new role
  await db.collection('users').updateMany(
    { email: 'supervisor@example.com' },
    { $set: { role: 'supervisor', permissions: ['supervise:all'] } }
  );
};
```

## 🚀 Kiểm tra Migration

```bash
npm run migration:status    # Xem trạng thái
npm run migration:run      # Chạy pending migrations
npm run migration:rollback # Rollback migration cuối
```

## ✅ Migration đã hoàn thành!

🎉 **RBAC system đã được setup thành công với:**
- ✅ 3 roles: admin, manager, user
- ✅ Permission-based access control
- ✅ Middleware cho route protection
- ✅ Migration system cho role management
- ✅ User model methods cho role/permission handling