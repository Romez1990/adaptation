from os import getenv
from dotenv import load_dotenv

load_dotenv()


def env(key: str) -> str:
    value = getenv(key)
    if value is None:
        raise EnvironmentError(f'no key {key} in .env file')
    return value


def env_bool(key: str) -> bool:
    value = env(key)
    if value == 'true':
        return True
    if value == 'false':
        return False
    raise EnvironmentError(f'key {key} can only be true or false')


def env_int(key: str) -> int:
    value = env(key)
    return int(value)


def env_float(key: str) -> float:
    value = env(key)
    return float(value)
