FROM node:18.20.4-bullseye
 
# Set the working directory
WORKDIR /app

# download and install openjdk-11-jre-headless
RUN apt-get update && apt-get install -y openjdk-11-jre-headless

# install python
RUN apt-get install -y python3

# copy all files from the root directory to the container
COPY . .

# install dependencies
RUN npm install

# build the app
RUN npm run dist

# expose the port
EXPOSE 80

# copy the entrypoint script
COPY ./entrypoint.sh /entrypoint.sh

# run the entrypoint script
CMD ["sh","/entrypoint.sh"]
 
