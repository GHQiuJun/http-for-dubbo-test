# 使用Node.js的基础镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装应用程序的依赖项
RUN npm install

# 将应用程序的源代码复制到工作目录
COPY . .

# 暴露应用程序运行的端口
EXPOSE 3000

# 在容器启动时运行应用程序
CMD [ "node", "index.js" ]