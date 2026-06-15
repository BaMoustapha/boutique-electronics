import logging
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def format_fcfa(amount):
    return f"{int(amount):,} F CFA".replace(',', ' ')


def send_order_notification(order):
    """Email envoyé à l'admin à chaque nouvelle commande."""
    lines = '\n'.join(
        f"  • {item.quantity}× {item.product_name} — {format_fcfa(item.product_price)} "
        f"→ {format_fcfa(item.subtotal)}"
        for item in order.items.all()
    )

    body = f"""
Nouvelle commande reçue sur votre boutique !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Commande : {order.order_number}
  Date     : {order.created_at.strftime('%d/%m/%Y à %H:%M')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLIENT
  Nom       : {order.customer_name}
  Téléphone : {order.customer_phone}
  Email     : {order.customer_email or '—'}

LIVRAISON
  Zone    : {order.delivery_zone}
  Adresse : {order.delivery_address}
  Note    : {order.note or '—'}

ARTICLES COMMANDÉS
{lines}

  TOTAL : {format_fcfa(order.total_amount)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connectez-vous à l'admin pour confirmer cette commande.
"""

    try:
        send_mail(
            subject=f'[Boutique] Nouvelle commande {order.order_number} — {order.customer_name}',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
        )
    except Exception:
        logger.exception('Échec envoi email admin — commande %s', order.order_number)


def send_order_confirmation_to_customer(order):
    """Email de confirmation envoyé au client (si email fourni)."""
    if not order.customer_email:
        return

    lines = '\n'.join(
        f"  • {item.quantity}× {item.product_name} — {format_fcfa(item.subtotal)}"
        for item in order.items.all()
    )

    body = f"""
Bonjour {order.customer_name},

Votre commande a bien été reçue. Nous vous contacterons très prochainement au {order.customer_phone} pour confirmer et organiser la livraison.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Numéro de commande : {order.order_number}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VOS ARTICLES
{lines}

  TOTAL : {format_fcfa(order.total_amount)}

LIVRAISON
  Zone    : {order.delivery_zone}
  Adresse : {order.delivery_address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Merci pour votre confiance !
Boutique Electronics Sénégal
"""

    try:
        send_mail(
            subject=f'Confirmation de commande {order.order_number} — Boutique Electronics',
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.customer_email],
        )
    except Exception:
        logger.exception('Échec envoi email client — commande %s', order.order_number)
