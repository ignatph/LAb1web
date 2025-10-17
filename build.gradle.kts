plugins {
    java
    war
}

group = "ru.rmntim"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    flatDir {
        dirs("libs")
    }
}

dependencies {
    compileOnly("jakarta.servlet:jakarta.servlet-api:6.0.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.2")
}

// WAR-проект, точка входа приложению не требуется

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.test {
    useJUnitPlatform()
}

// Удалены задачи fatJar и jar main-class — для WAR не нужны

tasks.jar {
}

// Статические файлы будут располагаться в src/main/webapp

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}