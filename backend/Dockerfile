# ── Stage 1: Build the JAR ────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build
 
WORKDIR /app
 
# Copy pom.xml first for better layer caching
# Docker won't re-download dependencies if pom.xml hasn't changed
COPY pom.xml .
RUN mvn dependency:go-offline -B
 
# Copy source code and build the JAR, skipping tests
COPY src ./src
RUN mvn package -DskipTests
 
# ── Stage 2: Run the JAR ───────────────────────────────
FROM eclipse-temurin:17-jdk-alpine
 
WORKDIR /app
 
# Copy only the built JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar
 
EXPOSE 8080
 
ENTRYPOINT ["java", "-jar", "app.jar"]