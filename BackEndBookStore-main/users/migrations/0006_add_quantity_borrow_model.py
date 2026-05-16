# Run after applying your existing migrations:
#   python manage.py migrate
#
# This file is for reference. Django will auto-generate it when you run:
#   python manage.py makemigrations store

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0005_alter_book_status'),   # your latest existing migration
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # ── Add quantity to Book ──────────────────────────────────────────────
        migrations.AddField(
            model_name='book',
            name='quantity',
            field=models.IntegerField(default=1),
        ),
        # ── Add image URL to Book ─────────────────────────────────────────────
        migrations.AddField(
            model_name='book',
            name='image',
            field=models.URLField(blank=True, default=''),
        ),
        # ── Fix status default to "Available" ─────────────────────────────────
        migrations.AlterField(
            model_name='book',
            name='status',
            field=models.CharField(default='Available', max_length=100),
        ),
        # ── Create Borrow model ───────────────────────────────────────────────
        migrations.CreateModel(
            name='Borrow',
            fields=[
                ('id',          models.BigAutoField(auto_created=True, primary_key=True,
                                                    serialize=False, verbose_name='ID')),
                ('borrow_date', models.DateTimeField(auto_now_add=True)),
                ('return_date', models.DateTimeField(blank=True, null=True)),
                ('is_active',   models.BooleanField(default=True)),
                ('book',        models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                                   related_name='borrows', to='store.book')),
                ('user',        models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                                   related_name='borrows',
                                                   to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-borrow_date']},
        ),
    ]
