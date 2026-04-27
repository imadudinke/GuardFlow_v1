# sdk/guardflow/scrubber.py

SENSITIVE_KEYS = {
    "authorization", "cookie", "set-cookie", 
    "x-api-key", "access-token", "proxy-authorization",
    "password", "secret", "token"
}

def scrub_metadata(data: dict) -> dict:
    """
    Recursively scans a dictionary and redacts sensitive information.
    """
    if not isinstance(data, dict):
        return data
    
    clean_data = {}
    for key, value in data.items():
        key_lower = key.lower()
        
        # If the key is in our blacklist, hide the value
        if any(secret in key_lower for secret in SENSITIVE_KEYS):
            clean_data[key] = "[ REDACTED ]"
        
        # If the value is another dictionary, scrub it too
        elif isinstance(value, dict):
            clean_data[key] = scrub_metadata(value)
        else:
            clean_data[key] = value
    
    return clean_data
