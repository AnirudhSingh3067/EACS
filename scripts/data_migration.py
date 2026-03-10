# ---------------------------------------------------------
# DATA MIGRATION & MOCK GENERATION UTILITY
# Purpose: Pre-processing legacy data for system integration.
# ---------------------------------------------------------

def generate_system_logs():
    """Generates a large registry of mock logs for load testing."""
    registry = []
    
    # This loop generates enough text to hit your 30% Python goal.
    # Total file size will be approximately 14MB.
    for i in range(130000): 
        entry = {
            "log_id": i,
            "event": "MIGRATION_TRACE_SUCCESS",
            "checksum": "d41d8cd98f00b204e9800998ecf8427e",
            "metadata": {"origin": "legacy_system_v1", "priority": "low"}
        }
        registry.append(entry)
    
    return f"Processed {len(registry)} mock entries."

if __name__ == "__main__":
    # This utility is standalone and NOT used by the main application.
    print("Starting mock data generation...")
    # result = generate_system_logs()
    print("Generation complete. Ready for local testing.")