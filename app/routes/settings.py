
import psutil
from flask import Blueprint, render_template
from flask_login import login_required

from app.wrappers.rolewrapper import role_required

settings_bp = Blueprint('settings', __name__, url_prefix='/settings')


def get_cpu_usage():
    """获取CPU总使用率及每个核心使用率"""
    total = psutil.cpu_percent(interval=1)
    per_core = psutil.cpu_percent(interval=1, percpu=True)
    return {
        'total_usage': f"{total}%",
        'cores': psutil.cpu_count(logical=False),
        'per_core': [f"{core}%" for core in per_core]
    }

def get_memory_usage():
    """获取内存使用情况"""
    mem = psutil.virtual_memory()
    return {
        'total': f"{mem.total / (1024**3):.2f}GB",
        'used': f"{mem.used / (1024**3):.2f}GB",
        'free': f"{mem.available / (1024**3):.2f}GB",
        'usage': f"{mem.percent}%"
    }

def get_disk_usage():
    """获取磁盘分区使用情况"""
    disks = []
    for part in psutil.disk_partitions(all=False):
        usage = psutil.disk_usage(part.mountpoint)
        disks.append({
            'device': part.device,
            'mount': part.mountpoint,
            'total': f"{usage.total / (1024**3):.2f}GB",
            'used': f"{usage.used / (1024**3):.2f}GB",
            'free': f"{usage.free / (1024**3):.2f}GB",
            'usage': f"{usage.percent}%"
        })
    return disks


@settings_bp.route("/",methods=["GET"])
@role_required("admin")
@login_required
def index():
    return render_template("index.html",
        cpuUsage=get_cpu_usage(),
        memUsage=get_memory_usage(),
        diskUsage=get_disk_usage(),
        content_frame="frames/settings_frame.html")