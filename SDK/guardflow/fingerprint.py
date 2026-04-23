"""
Device Fingerprinting - The "DNA" logic
Generates unique identifiers for devices/browsers
"""

import hashlib

IGNORE_HEADERS = {
    "authorization", "cookie", "x-guardflow-trace", 
    "host", "content-length", "x-request-id"
}

def create_fingerprint(headers: dict) -> str:
    
    header_keys = [ 
        k.lower() for k in headers.keys() 
        if k.lower() not in IGNORE_HEADERS
    ]

    header_keys.sort()

    user_agent = headers.get("user-agent", "")
    accept_lang = headers.get("accept-language", "")
    
   
    header_sequence = "-".join(headers.keys())
    
    dna_blueprint = f"{user_agent}|{accept_lang}|{','.join(header_keys)}"
    
    return hashlib.sha256(dna_blueprint.encode()).hexdigest()