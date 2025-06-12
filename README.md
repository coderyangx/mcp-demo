# weatherMcp
## 这是一个获取天气/日期相关的 mcpServer demo

### 基于 yeoman 生成 mcpServer 开发框架
```bash
npm install -g yo generator-mcp # 安装 yo

yo mcp --mcpServerName 'weatherMcp' # 创建 mcpServer
```

## usage

```bash
npm install

```

## use by cursor

```json
{
  "mcpServers": {
    "my-weather": {
      "command": "npx",
      "args": ["-y", "mcp-demo"]
    },
    "12306-mcp": {
      "command": "npx",
      "args": ["-y", "12306-mcp"],
      "env": {}
    }
  }
}
```
