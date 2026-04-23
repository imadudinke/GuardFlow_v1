import redis.asyncio as redis # Use the async version!

class RateLimiter:
    _pool = None

    def __init__(self, redis_url: str):
        if RateLimiter._pool is None:
            RateLimiter._pool = redis.ConnectionPool.from_url(
                redis_url, 
                decode_responses=True,
                max_connections=20
            )
        self.r = redis.Redis(connection_pool=RateLimiter._pool)

    async def is_rate_limited(self, dna: str, limit: int = 10, window: int = 60) -> bool:
        key = f"gf:rate:{dna}"
        
        async with self.r.pipeline(transaction=True) as pipe:
            pipe.incr(key)
            pipe.expire(key, window, nx=True) # nx=True only sets expire if not set
            res = await pipe.execute()
            current_hits = res[0]
            
        return current_hits > limit

    async def check_and_ban(self, dna: str, limit: int = 10, ban_threshold: int = 50) -> str:
        key = f"gf:rate:{dna}"
        ban_key = f"gf:ban:{dna}"

        # 1. Check ban status first
        if await self.r.exists(ban_key):
            return "BANNED"

        # 2. Atomic Increment
        async with self.r.pipeline(transaction=True) as pipe:
            pipe.incr(key)
            pipe.expire(key, 60, nx=True)
            res = await pipe.execute()
            current_hits = res[0]

        # 3. Logic checks
        if current_hits > ban_threshold:
            await self.r.setex(ban_key, 3600, "1")
            return "BANNED"
        
        if current_hits > limit:
            return "LIMIT"

        return "OK"
