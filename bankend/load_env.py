"""
环境变量加载脚本
在应用启动前调用此脚本来加载.env文件中的环境变量
"""
import os
from pathlib import Path

def load_env_file(env_file='.env'):
    """
    加载.env文件中的环境变量
    
    Args:
        env_file (str): .env文件路径
    """
    env_path = Path(env_file)
    
    if not env_path.exists():
        print(f"警告: {env_file} 文件不存在，请先复制 env.example 为 .env 并配置相关参数")
        return
    
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # 跳过空行和注释行
            if not line or line.startswith('#'):
                continue
            
            # 解析键值对
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                # 移除引号
                if value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                
                # 设置环境变量
                os.environ[key] = value

if __name__ == '__main__':
    load_env_file()
    print("环境变量加载完成")
