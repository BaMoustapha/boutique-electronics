#!/usr/bin/env python
"""Utilitaire en ligne de commande Django."""
import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Impossible d'importer Django. Vérifie que Django est installé "
            "et disponible dans ta variable d'environnement PYTHONPATH. "
            "As-tu oublié d'activer ton environnement virtuel ?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
