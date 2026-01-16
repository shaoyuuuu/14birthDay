1. **问题分析**：错误信息显示 "relation 'roles' does not exist"，数据库缺少 roles 表。

2. **根本原因**：

   * `migrations.js` 文件中定义了 `createTables()` 函数，用于创建 roles、permissions 和 role\_permissions 表

   * 但 `migrate.js` 文件（实际执行迁移的文件）并没有调用这个函数

   * `migrate.js` 只创建了 admins、visits、messages 和 memories 表

3. **修复方案**：修改 `migrate.js` 文件，导入并调用 `migrations.js` 中的 `createTables()` 函数，确保所有必要的表都被创建。

4. **具体修改**：

   * 在 `migrate.js` 文件中导入 `createTables` 函数

   * 在迁移过程中调用 `createTables` 函数

   * 确保迁移流程完整执行所有表的创建

5. **验证方法**：执行迁移命令后，检查数据库中是否存在 roles 表，以及相关的权限表。

