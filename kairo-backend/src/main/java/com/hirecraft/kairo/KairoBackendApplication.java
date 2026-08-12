package com.hirecraft.kairo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class KairoBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(KairoBackendApplication.class, args);
	}

}
