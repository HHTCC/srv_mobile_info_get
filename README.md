# KOA框架和数据库和log4jf使用说明
## 工具
- 在线调试 [http请求]<http://www.ojit.com/httptest>

## 系统
- Windows/Linux

## 环境
- Node.js v7.6.0或以上版本
- Mysql v5.7.26或以上

## 数据库
- 数据库文件说明 ：sql/and_ios_web_data.sql
- 数据库名：and_ios_web_data
- 编码：utf8mb4
- 排序规则：utf8mb4_general_ci

## 部署到本地或服务器
- 到根目录下 命令行运行 npm install 安装库组件
- 到 app/config/config.js 目录下修改各种配置
- 到根目录下 最后命令行启动 npm run app 即可 
- 启动完成后在可访问浏览器输入 [本机地址]<http://localhost:监听端口>/ 如果显示·服务器正常运行·说明启动成功
