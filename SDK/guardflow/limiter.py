import redis

class RateLimiter:
    _connection = None 

    def __init__(self, redis_url: str):
        if RateLimiter._connection is None:
            print("🔌 [GuardFlow] Establishing Redis Connection Pool...")
            RateLimiter._connection = redis.from_url(
                redis_url, 
                decode_responses=True,
                max_connections=20  
            )
        self.r = RateLimiter._connection

    def is_rate_limited(self, dna: str, limit: int = 10, window: int = 60) -> bool:
        """
        The actual logic that checks Redis.
        """
        key = f"gf:rate:{dna}"
        
        current_hits = self.r.incr(key)
        
        if current_hits == 1:
            self.r.expire(key, window)
            
        return current_hits > limit
