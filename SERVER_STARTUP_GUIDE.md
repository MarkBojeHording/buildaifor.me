# 🚀 Server Startup Guide - Anti-Stalling Edition

## **The Problem**
The AI assistant overcomplicates server startup. This guide provides EXACT commands to prevent stalling.

## **The Solution**
Copy and paste these commands exactly. No thinking required.

---

## 🏠 **Main Website (Port 5173)**

### Start Command:
```bash
cd /Users/markhording/Desktop/BuildAIFor.Me-Business && npm run dev
```

### Stop Command:
```bash
pkill -f "vite"
```

---

## 🤖 **AI Email Analysis Workflow (Port 3003)**

### Start Command:
```bash
cd /Users/markhording/Desktop/BuildAIFor.Me-Business/templates/workflow-optimization-template && node server.js
```

### Stop Command:
```bash
pkill -f "node.*server.js"
```

### Test Command:
```bash
curl http://localhost:3003/api/health
```

---

## 📄 **Document Processing Tool (Port 3002)**

### Backend Start:
```bash
cd /Users/markhording/Desktop/BuildAIFor.Me-Business/templates/document-processing-template/backend && npm start
```

### Frontend Start:
```bash
cd /Users/markhording/Desktop/BuildAIFor.Me-Business/templates/document-processing-template/frontend && npm run dev
```

### Stop Command:
```bash
pkill -f "node.*3002"
```

---

## 🤖 **Chatbot Template (Port 3001)**

### Start Command:
```bash
cd /Users/markhording/Desktop/BuildAIFor.Me-Business/templates/chatbot-template && npm start
```

### Stop Command:
```bash
pkill -f "node.*3001"
```

---

## 🎯 **How to Use This Guide**

### **For the AI Assistant:**
1. Copy the exact command you want
2. Say: "Run this command: [paste command here]"
3. The assistant will execute immediately without thinking

### **Example:**
```
"Run this command: cd /Users/markhording/Desktop/BuildAIFor.Me-Business/templates/workflow-optimization-template && node server.js"
```

---

## 🔧 **Troubleshooting Commands**

### Kill All Node Processes:
```bash
pkill -f node
```

### Check What's Running:
```bash
ps aux | grep node
```

### Check Port Usage:
```bash
lsof -i :3003
```

### Install Dependencies (if needed):
```bash
cd [project-directory] && npm install
```

---

## 📋 **Quick Reference - All Servers**

| Service | Port | Start Command |
|---------|------|---------------|
| Main Website | 5173 | `cd /Users/markhording/Desktop/BuildAIFor.Me-Business && npm run dev` |
| Email Analysis | 3003 | `cd templates/workflow-optimization-template && node server.js` |
| Document Backend | 3002 | `cd templates/document-processing-template/backend && npm start` |
| Document Frontend | 5174 | `cd templates/document-processing-template/frontend && npm run dev` |
| Chatbot | 3001 | `cd templates/chatbot-template && npm start` |

---

## 🚨 **Emergency Commands**

### Kill Everything:
```bash
pkill -f node && pkill -f vite
```

### Restart Everything:
```bash
pkill -f node && pkill -f vite && sleep 2 && cd /Users/markhording/Desktop/BuildAIFor.Me-Business && npm run dev &
```

---

## 💡 **Pro Tips**

1. **Always use exact paths** - no relative paths
2. **Copy-paste commands** - don't type them
3. **Use background mode** - add `&` to run in background
4. **Check ports first** - use `lsof -i :[port]` before starting

---

## 🎯 **For the AI Assistant**

**When you see this guide, just run the exact command provided. No analysis, no checking, no stalling. Just execute.**

**Remember:** The user wants speed, not thoroughness. Execute immediately.
