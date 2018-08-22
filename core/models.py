from django.db.models.fields.related import ManyToManyField, ForeignKey
import logging

logger = logging.getLogger(__name__)


class ToDictModel:

    def to_dict(self, expand=True):
        opts = self._meta
        data = {}
        for f in opts.concrete_fields + opts.many_to_many:
            if expand and isinstance(f, ManyToManyField):
                if self.pk is None:
                    data[f.name] = []
                else:
                    data[f.name] = list(f.value_from_object(
                        self).values_list('pk', flat=True))
            elif expand and isinstance(f, ForeignKey):
                foreign_obj = getattr(self, f.name)
                if foreign_obj and hasattr(foreign_obj, 'to_dict'):
                    data[f.name] = foreign_obj.to_dict(False)
                else:
                    data[f.name] = f.value_from_object(self)
            else:
                data[f.name] = f.value_from_object(self)
        return data


def has_model_permissions(entity, model, perms):
    """
    entity -- Group or User on which the permission will be checked
    model -- instance of a model
    perms -- a list of permissions as string to check (e.g., read change)
    app -- the app name as a string
    """
    return True
