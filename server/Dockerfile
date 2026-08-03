#build
FROM maven:3-eclipse-temurin-17 AS build
COPY . .

ENV MAVEN_OPTS="-Xmx256m"
RUN mvn clean package -DskipTests

#run
FROM eclipse-temurin:17-alpine
COPY --from=build target/*.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar", "--server.port=${PORT}"]