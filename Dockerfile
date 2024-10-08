FROM node:20.15.1

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application source code to the working directory
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port that the application will run on
EXPOSE 3000

# Create a directory for persistent data storage
VOLUME /data

# Define the command to start the application
CMD ["yarn", "start"]