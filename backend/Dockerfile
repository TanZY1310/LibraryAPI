# Use Eclipse Temurin (the recommended OpenJDK replacement)
FROM eclipse-temurin:17-jdk-alpine

# Copy the JAR package into the image
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expose the application port
EXPOSE 8080

# Run the App
ENTRYPOINT ["java", "-jar", "/app.jar"]
