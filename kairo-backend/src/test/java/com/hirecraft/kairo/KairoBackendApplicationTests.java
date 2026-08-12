package com.hirecraft.kairo;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Minimal smoke test — does not boot the full Spring context so it needs no DB.
 * Replace with @SpringBootTest slices as real tests are added.
 */
class KairoBackendApplicationTests {

    @Test
    void contextLoads() {
        assertTrue(true);
    }
}
