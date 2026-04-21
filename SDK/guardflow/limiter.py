import redis

class RateLimiter:
    def __init__(self, redis_url: str):
        self.r = redis.from_url(redis_url, decode_responses=True)

    def is_rate_limited(self, dna: str, limit: int = 10, window: int = 60) -> bool:
        """
        Tracks hits per DNA fingerprint.
        limit: Max requests allowed
        window: Time period in seconds
        """
        key = f"gf:rate:{dna}"
        current_hits = self.r.incr(key)
        
        if current_hits == 1:
            self.r.expire(key, window)
            
        return current_hits > limit
