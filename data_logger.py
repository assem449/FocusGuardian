import pandas as pd
import random

def get_app_usage():
    """
    Simulate app usage logs with focus/distraction classification.
    Returns:
        pd.DataFrame: Columns ['app', 'category']
    """
    focus_apps = ['VSCode', 'PyCharm', 'Jupyter', 'Terminal', 'Sublime Text']
    distraction_apps = ['YouTube', 'Twitter', 'Reddit', 'Instagram', 'Netflix']
    apps = random.choices(focus_apps, k=3) + random.choices(distraction_apps, k=2)
    random.shuffle(apps)
    data = []
    for app in apps:
        category = 'focus' if app in focus_apps else 'distraction'
        data.append({'app': app, 'category': category})
    return pd.DataFrame(data) 