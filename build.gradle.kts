plugins {
    java
    application
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
    implementation(files("libs/fastcgi-lib.jar"))
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.2")
}

application {
    mainClass.set("ru.rmntim.Main")
}

tasks.withType<JavaCompile> {
    options.encoding = "UTF-8"
}

tasks.test {
    useJUnitPlatform()
}

// Задача для создания fat JAR
tasks.register<Jar>("fatJar") {
    archiveBaseName.set("server")
    archiveClassifier.set("fat")
    archiveVersion.set("") // Убираем версию из имени файла

    manifest {
        attributes(
            "Main-Class" to "ru.rmntim.Main",
            "Class-Path" to configurations.runtimeClasspath.get().files.joinToString(" ") { it.name }
        )
    }

    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
    with(tasks.jar.get())
}

// Настройка обычной задачи jar
tasks.jar {
    manifest {
        attributes(
            "Main-Class" to "ru.rmntim.Main",
            "Class-Path" to configurations.runtimeClasspath.get().files.joinToString(" ") { it.name }
        )
    }
}

tasks.register<Copy>("copyWebResources") {
    from("web")
    into("build/resources/main/web")
}

tasks.processResources {
    dependsOn("copyWebResources")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}