package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class BookTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Book getBookSample1() {
        return new Book().id(1L).name("name1").title("title1");
    }

    public static Book getBookSample2() {
        return new Book().id(2L).name("name2").title("title2");
    }

    public static Book getBookRandomSampleGenerator() {
        return new Book().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).title(UUID.randomUUID().toString());
    }
}
