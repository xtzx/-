function factorial(N) {
    if (N === 1) {
        return 1;
    } else {
        return N * factorial(N - 1);
    }
}

factorial(2);
