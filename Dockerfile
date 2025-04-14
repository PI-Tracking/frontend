FROM node:22.11-alpine

# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json
COPY package.json ./
 
# Install dependencies
RUN npm install --force --loglevel verbose
 
# Copy the rest of your application files
COPY . .
 
# Expose the port your app runs on
EXPOSE 5173

# Define the command to run your app
CMD ["npm", "run", "dev", "--", "--host"]
