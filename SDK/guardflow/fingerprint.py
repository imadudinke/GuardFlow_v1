"""
Device Fingerprinting - The "DNA" logic
Generates unique identifiers for devices/browsers
"""

import hashlib


def create_fingerprint(headers: dict) -> str:
    """
    Generate a unique fingerprint hash from request headers
    
    Args:
        headers: Request headers dictionary
        
    Returns:
        Unique fingerprint hash (DNA ID)
    """
    # We pick parts that stay the same even if IP changes
    user_agent = headers.get("user-agent", "")
    accept_lang = headers.get("accept-language", "")
    
    # The "Senior" Secret: The sequence of header keys
    header_sequence = "-".join(headers.keys())
    
    dna_string = f"{user_agent}|{accept_lang}|{header_sequence}"
    return hashlib.sha256(dna_string.encode()).hexdigest()
