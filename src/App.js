import React, { useState, useMemo } from 'react';
import { Search, Terminal, BookOpen, Brain } from 'lucide-react';

// Importing new components
import TerminalSimulator from './TerminalSimulator';
import KnowledgeTest from './KnowledgeTest';

const commands = [
  // File and Directory Operations
  { name: 'ls', description: 'عرض محتويات الدليل', example: 'ls -l', category: 'ملفات ومجلدات' },
  { name: 'cd', description: 'تغيير الدليل الحالي', example: 'cd /home/user', category: 'ملفات ومجلدات' },
  { name: 'pwd', description: 'عرض مسار الدليل الحالي', example: 'pwd', category: 'ملفات ومجلدات' },
  { name: 'mkdir', description: 'إنشاء مجلد جديد', example: 'mkdir new_folder', category: 'ملفات ومجلدات' },
  { name: 'rmdir', description: 'حذف مجلد فارغ', example: 'rmdir empty_folder', category: 'ملفات ومجلدات' },
  { name: 'rm', description: 'حذف ملفات أو مجلدات', example: 'rm file.txt', category: 'ملفات ومجلدات' },
  { name: 'cp', description: 'نسخ ملفات أو مجلدات', example: 'cp file.txt /path/to/destination', category: 'ملفات ومجلدات' },
  { name: 'mv', description: 'نقل أو إعادة تسمية ملفات أو مجلدات', example: 'mv old_name.txt new_name.txt', category: 'ملفات ومجلدات' },
  { name: 'touch', description: 'إنشاء ملف فارغ أو تحديث وقت التعديل', example: 'touch new_file.txt', category: 'ملفات ومجلدات' },
  { name: 'file', description: 'تحديد نوع الملف', example: 'file document.pdf', category: 'ملفات ومجلدات' },

  // File Content Operations
  { name: 'cat', description: 'عرض محتوى ملف', example: 'cat file.txt', category: 'محتوى الملفات' },
  { name: 'less', description: 'عرض محتوى ملف بشكل تفاعلي', example: 'less large_file.txt', category: 'محتوى الملفات' },
  { name: 'head', description: 'عرض الأسطر الأولى من ملف', example: 'head -n 10 file.txt', category: 'محتوى الملفات' },
  { name: 'tail', description: 'عرض الأسطر الأخيرة من ملف', example: 'tail -n 10 file.txt', category: 'محتوى الملفات' },
  { name: 'grep', description: 'البحث عن نص في الملفات', example: 'grep "pattern" file.txt', category: 'محتوى الملفات' },
  { name: 'sed', description: 'تحرير النص في الملفات', example: 'sed "s/old/new/g" file.txt', category: 'محتوى الملفات' },
  { name: 'awk', description: 'معالجة وتحليل النصوص', example: 'awk "{print $1}" file.txt', category: 'محتوى الملفات' },
  { name: 'sort', description: 'فرز محتوى الملف', example: 'sort file.txt', category: 'محتوى الملفات' },
  { name: 'uniq', description: 'إزالة الأسطر المكررة المتتالية', example: 'uniq file.txt', category: 'محتوى الملفات' },
  { name: 'wc', description: 'عد الأسطر والكلمات والأحرف', example: 'wc -l file.txt', category: 'محتوى الملفات' },

  // System Information
  { name: 'uname', description: 'عرض معلومات النظام', example: 'uname -a', category: 'معلومات النظام' },
  { name: 'hostname', description: 'عرض أو تعيين اسم المضيف', example: 'hostname', category: 'معلومات النظام' },
  { name: 'uptime', description: 'عرض مدة تشغيل النظام', example: 'uptime', category: 'معلومات النظام' },
  { name: 'whoami', description: 'عرض اسم المستخدم الحالي', example: 'whoami', category: 'معلومات النظام' },
  { name: 'id', description: 'عرض معرف المستخدم والمجموعة', example: 'id', category: 'معلومات النظام' },
  { name: 'date', description: 'عرض أو تعيين تاريخ ووقت النظام', example: 'date', category: 'معلومات النظام' },
  { name: 'cal', description: 'عرض التقويم', example: 'cal', category: 'معلومات النظام' },
  { name: 'free', description: 'عرض استخدام الذاكرة', example: 'free -h', category: 'معلومات النظام' },
  { name: 'df', description: 'عرض مساحة القرص المتوفرة', example: 'df -h', category: 'معلومات النظام' },
  { name: 'du', description: 'عرض استخدام مساحة القرص للملفات والمجلدات', example: 'du -sh *', category: 'معلومات النظام' },

  // Process Management
  { name: 'ps', description: 'عرض العمليات الجارية', example: 'ps aux', category: 'إدارة العمليات' },
  { name: 'top', description: 'عرض العمليات بشكل تفاعلي', example: 'top', category: 'إدارة العمليات' },
  { name: 'kill', description: 'إنهاء عملية', example: 'kill -9 PID', category: 'إدارة العمليات' },
  { name: 'killall', description: 'إنهاء جميع العمليات باسم معين', example: 'killall process_name', category: 'إدارة العمليات' },
  { name: 'bg', description: 'تشغيل عملية في الخلفية', example: 'bg %1', category: 'إدارة العمليات' },
  { name: 'fg', description: 'جلب عملية إلى المقدمة', example: 'fg %1', category: 'إدارة العمليات' },
  { name: 'jobs', description: 'عرض العمليات الجارية في الخلفية', example: 'jobs', category: 'إدارة العمليات' },
  { name: 'nohup', description: 'تشغيل أمر مع تجاهل إشارات الانقطاع', example: 'nohup command &', category: 'إدارة العمليات' },
  { name: 'nice', description: 'تشغيل أمر بأولوية معينة', example: 'nice -n 10 command', category: 'إدارة العمليات' },
  { name: 'renice', description: 'تغيير أولوية عملية قائمة', example: 'renice -n 5 -p PID', category: 'إدارة العمليات' },

  // User and Permissions
  { name: 'sudo', description: 'تنفيذ أمر بصلاحيات المشرف', example: 'sudo command', category: 'المستخدمين والصلاحيات' },
  { name: 'su', description: 'تبديل المستخدم', example: 'su username', category: 'المستخدمين والصلاحيات' },
  { name: 'chmod', description: 'تغيير صلاحيات الملف أو المجلد', example: 'chmod 755 file.txt', category: 'المستخدمين والصلاحيات' },
  { name: 'chown', description: 'تغيير مالك الملف أو المجلد', example: 'chown user:group file.txt', category: 'المستخدمين والصلاحيات' },
  { name: 'useradd', description: 'إضافة مستخدم جديد', example: 'sudo useradd newuser', category: 'المستخدمين والصلاحيات' },
  { name: 'userdel', description: 'حذف مستخدم', example: 'sudo userdel username', category: 'المستخدمين والصلاحيات' },
  { name: 'passwd', description: 'تغيير كلمة المرور', example: 'passwd', category: 'المستخدمين والصلاحيات' },
  { name: 'groups', description: 'عرض المجموعات التي ينتمي إليها المستخدم', example: 'groups username', category: 'المستخدمين والصلاحيات' },
  { name: 'groupadd', description: 'إضافة مجموعة جديدة', example: 'sudo groupadd newgroup', category: 'المستخدمين والصلاحيات' },
  { name: 'groupdel', description: 'حذف مجموعة', example: 'sudo groupdel groupname', category: 'المستخدمين والصلاحيات' },

  // Networking
  { name: 'ping', description: 'اختبار الاتصال بعنوان IP أو اسم نطاق', example: 'ping google.com', category: 'الشبكات' },
  { name: 'ifconfig', description: 'عرض أو تكوين واجهات الشبكة', example: 'ifconfig', category: 'الشبكات' },
  { name: 'ip', description: 'عرض أو تكوين واجهات الشبكة (بديل حديث لـ ifconfig)', example: 'ip addr show', category: 'الشبكات' },
  { name: 'netstat', description: 'عرض اتصالات الشبكة والإحصائيات', example: 'netstat -tuln', category: 'الشبكات' },
  { name: 'ss', description: 'عرض معلومات المقبس (بديل حديث لـ netstat)', example: 'ss -tuln', category: 'الشبكات' },
  { name: 'wget', description: 'تنزيل ملفات من الإنترنت', example: 'wget https://example.com/file.zip', category: 'الشبكات' },
  { name: 'curl', description: 'نقل البيانات باستخدام بروتوكولات مختلفة', example: 'curl https://example.com', category: 'الشبكات' },
  { name: 'ssh', description: 'الاتصال بجهاز بعيد باستخدام بروتوكول SSH', example: 'ssh user@hostname', category: 'الشبكات' },
  { name: 'scp', description: 'نسخ الملفات بين الأجهزة باستخدام SSH', example: 'scp file.txt user@hostname:/path/to/destination', category: 'الشبكات' },
  { name: 'dig', description: 'استعلام عن معلومات DNS', example: 'dig example.com', category: 'الشبكات' },

  // Package Management (assuming a Debian-based system)
  { name: 'apt-get', description: 'إدارة الحزم (لأنظمة Debian)', example: 'sudo apt-get update', category: 'إدارة الحزم' },
  { name: 'apt', description: 'إدارة الحزم (واجهة حديثة لـ apt-get)', example: 'sudo apt update', category: 'إدارة الحزم' },
  { name: 'dpkg', description: 'إدارة الحزم الفردية', example: 'dpkg -i package.deb', category: 'إدارة الحزم' },
  { name: 'snap', description: 'إدارة حزم Snap', example: 'sudo snap install package', category: 'إدارة الحزم' },
  { name: 'yum', description: 'إدارة الحزم (لأنظمة Red Hat)', example: 'sudo yum update', category: 'إدارة الحزم' },
  { name: 'rpm', description: 'إدارة الحزم الفردية (لأنظمة Red Hat)', example: 'rpm -i package.rpm', category: 'إدارة الحزم' },

  // Compression and Archiving
  { name: 'tar', description: 'إنشاء أو استخراج الأرشيفات', example: 'tar -cvf archive.tar files', category: 'الضغط والأرشفة' },
  { name: 'gzip', description: 'ضغط أو فك ضغط الملفات', example: 'gzip file.txt', category: 'الضغط والأرشفة' },
  { name: 'gunzip', description: 'فك ضغط الملفات المضغوطة بـ gzip', example: 'gunzip file.txt.gz', category: 'الضغط والأرشفة' },
  { name: 'zip', description: 'إنشاء أرشيفات zip', example: 'zip archive.zip files', category: 'الضغط والأرشفة' },

  { name: 'bzip2', description: 'ضغط الملفات باستخدام خوارزمية bzip2', example: 'bzip2 file.txt', category: 'الضغط والأرشفة' },
  { name: 'bunzip2', description: 'فك ضغط الملفات المضغوطة بـ bzip2', example: 'bunzip2 file.txt.bz2', category: 'الضغط والأرشفة' },

  // Text Editing
  { name: 'nano', description: 'محرر نصوص بسيط وسهل الاستخدام', example: 'nano file.txt', category: 'تحرير النصوص' },
  { name: 'vim', description: 'محرر نصوص متقدم وقوي', example: 'vim file.txt', category: 'تحرير النصوص' },
  { name: 'emacs', description: 'محرر نصوص قابل للتخصيص بشكل كبير', example: 'emacs file.txt', category: 'تحرير النصوص' },

  // System Control
  { name: 'shutdown', description: 'إيقاف تشغيل أو إعادة تشغيل النظام', example: 'sudo shutdown -h now', category: 'التحكم بالنظام' },
  { name: 'reboot', description: 'إعادة تشغيل النظام', example: 'sudo reboot', category: 'التحكم بالنظام' },
  { name: 'systemctl', description: 'التحكم في نظام systemd والخدمات', example: 'systemctl status service_name', category: 'التحكم بالنظام' },

  // Disk Management
  { name: 'fdisk', description: 'إدارة أقسام القرص', example: 'sudo fdisk -l', category: 'إدارة الأقراص' },
  { name: 'mount', description: 'تحميل نظام ملفات', example: 'sudo mount /dev/sdb1 /mnt', category: 'إدارة الأقراص' },
  { name: 'umount', description: 'إلغاء تحميل نظام ملفات', example: 'sudo umount /mnt', category: 'إدارة الأقراص' },

  // System Monitoring
  { name: 'htop', description: 'عرض تفاعلي للعمليات ومراقبة الموارد', example: 'htop', category: 'مراقبة النظام' },
  { name: 'iotop', description: 'مراقبة نشاط I/O للقرص', example: 'sudo iotop', category: 'مراقبة النظام' },
  { name: 'vmstat', description: 'عرض إحصائيات الذاكرة الافتراضية', example: 'vmstat 1', category: 'مراقبة النظام' },

  // Scheduling Tasks
  { name: 'cron', description: 'جدولة المهام للتشغيل في أوقات محددة', example: 'crontab -e', category: 'جدولة المهام' },
  { name: 'at', description: 'جدولة مهمة للتشغيل مرة واحدة في وقت محدد', example: 'at 10:00 PM', category: 'جدولة المهام' },

  // Miscellaneous
  { name: 'alias', description: 'إنشاء اختصارات للأوامر', example: 'alias ll="ls -la"', category: 'متنوعة' },
  { name: 'history', description: 'عرض سجل الأوامر السابقة', example: 'history', category: 'متنوعة' },
  { name: 'clear', description: 'مسح شاشة الطرفية', example: 'clear', category: 'متنوعة' },
  { name: 'man', description: 'عرض دليل الاستخدام للأوامر', example: 'man ls', category: 'متنوعة' },
  { name: 'which', description: 'تحديد موقع الأمر التنفيذي', example: 'which python', category: 'متنوعة' },
  { name: 'xargs', description: 'بناء وتنفيذ أوامر من الإدخال القياسي', example: 'find . -name "*.txt" | xargs cat', category: 'متنوعة' },
  { name: 'tee', description: 'قراءة من الإدخال القياسي والكتابة إلى الإخراج القياسي والملفات', example: 'echo "Hello" | tee file.txt', category: 'متنوعة' },

  // Advanced File Operations
  { name: 'find', description: 'البحث عن الملفات والمجلدات', example: 'find /home -name "*.txt"', category: 'عمليات الملفات المتقدمة' },
  { name: 'locate', description: 'البحث السريع عن الملفات باستخدام قاعدة بيانات محدثة مسبقًا', example: 'locate filename', category: 'عمليات الملفات المتقدمة' },
  { name: 'ln', description: 'إنشاء روابط صلبة أو رمزية', example: 'ln -s target_file link_name', category: 'عمليات الملفات المتقدمة' },

  // Security and Encryption
  { name: 'ssh-keygen', description: 'إنشاء مفاتيح SSH', example: 'ssh-keygen -t rsa', category: 'الأمان والتشفير' },
  { name: 'openssl', description: 'أداة للتشفير وإدارة الشهادات', example: 'openssl enc -aes-256-cbc -in file.txt -out file.enc', category: 'الأمان والتشفير' },

  // System Logs
  { name: 'journalctl', description: 'استعراض سجلات النظام في أنظمة systemd', example: 'journalctl -u service_name', category: 'سجلات النظام' },
  { name: 'dmesg', description: 'عرض رسائل حلقة التصحيح للنواة', example: 'dmesg', category: 'سجلات النظام' },

  // Hardware Information
  { name: 'lshw', description: 'عرض معلومات مفصلة عن الأجهزة', example: 'sudo lshw', category: 'معلومات الأجهزة' },
  { name: 'lsusb', description: 'عرض معلومات عن أجهزة USB', example: 'lsusb', category: 'معلومات الأجهزة' },
  { name: 'lspci', description: 'عرض معلومات عن أجهزة PCI', example: 'lspci', category: 'معلومات الأجهزة' },

  // Performance Tuning
  { name: 'nice', description: 'تشغيل برنامج بأولوية مختلفة', example: 'nice -n 10 command', category: 'ضبط الأداء' },
  { name: 'ionice', description: 'تعيين أولوية I/O للعملية', example: 'ionice -c 2 -n 0 command', category: 'ضبط الأداء' },

  // Version Control (Git)
  { name: 'git', description: 'نظام إدارة الإصدارات', example: 'git clone https://github.com/user/repo.git', category: 'إدارة الإصدارات' },

  // Package Information
  { name: 'dpkg-query', description: 'استعلام عن معلومات الحزم المثبتة (Debian)', example: 'dpkg-query -l | grep package_name', category: 'معلومات الحزم' },
  { name: 'rpm -q', description: 'استعلام عن معلومات الحزم المثبتة (Red Hat)', example: 'rpm -q package_name', category: 'معلومات الحزم' },

    // Advanced Text Processing
    { name: 'cut', description: 'استخراج أجزاء من كل سطر في الملف', example: 'cut -d ":" -f 1 /etc/passwd', category: 'معالجة النصوص المتقدمة' },
    { name: 'tr', description: 'ترجمة أو حذف الأحرف', example: 'echo "hello" | tr "elo" "ELO"', category: 'معالجة النصوص المتقدمة' },
    { name: 'diff', description: 'مقارنة الملفات سطرًا بسطر', example: 'diff file1.txt file2.txt', category: 'معالجة النصوص المتقدمة' },
    { name: 'patch', description: 'تطبيق ملف التصحيح على النص الأصلي', example: 'patch original_file.txt < patch_file.patch', category: 'معالجة النصوص المتقدمة' },
  
    // Process Management
    { name: 'pgrep', description: 'البحث عن العمليات حسب الاسم', example: 'pgrep firefox', category: 'إدارة العمليات' },
    { name: 'pkill', description: 'إرسال إشارة إلى العمليات حسب الاسم', example: 'pkill firefox', category: 'إدارة العمليات' },
    { name: 'watch', description: 'تنفيذ أمر بشكل دوري وعرض النتيجة', example: 'watch -n 1 "ps aux | grep nginx"', category: 'إدارة العمليات' },
  
    // Networking
    { name: 'nc', description: 'قراءة وكتابة البيانات عبر الشبكة', example: 'nc -l 1234', category: 'الشبكات' },
    { name: 'tcpdump', description: 'تحليل حركة مرور الشبكة', example: 'sudo tcpdump -i eth0', category: 'الشبكات' },
    { name: 'nmap', description: 'استكشاف الشبكة وفحص الأمان', example: 'nmap 192.168.1.0/24', category: 'الشبكات' },
    { name: 'iptables', description: 'تكوين جدار الحماية لنواة لينكس', example: 'sudo iptables -L', category: 'الشبكات' },
  
    // System Information
    { name: 'lsof', description: 'عرض الملفات المفتوحة', example: 'lsof -u username', category: 'معلومات النظام' },
    { name: 'strace', description: 'تتبع مكالمات النظام وإشارات العملية', example: 'strace ls', category: 'معلومات النظام' },
    { name: 'ulimit', description: 'عرض أو تعيين حدود موارد المستخدم', example: 'ulimit -a', category: 'معلومات النظام' },
  
    // File System Management
    { name: 'fsck', description: 'فحص وإصلاح نظام الملفات', example: 'sudo fsck /dev/sda1', category: 'إدارة نظام الملفات' },
    { name: 'badblocks', description: 'البحث عن القطاعات التالفة في القرص', example: 'sudo badblocks -v /dev/sda', category: 'إدارة نظام الملفات' },
    { name: 'tune2fs', description: 'ضبط معلمات نظام الملفات ext2/ext3/ext4', example: 'sudo tune2fs -l /dev/sda1', category: 'إدارة نظام الملفات' },
  
    // Package Management (additional commands)
    { name: 'aptitude', description: 'واجهة عالية المستوى لإدارة الحزم', example: 'sudo aptitude update', category: 'إدارة الحزم' },
    { name: 'dnf', description: 'مدير الحزم لتوزيعات Fedora (بديل لـ yum)', example: 'sudo dnf update', category: 'إدارة الحزم' },
  
    // Text Editing and Processing
    { name: 'tac', description: 'عرض محتوى الملف بترتيب عكسي', example: 'tac file.txt', category: 'تحرير ومعالجة النصوص' },
    { name: 'nl', description: 'إضافة أرقام الأسطر إلى الملف', example: 'nl file.txt', category: 'تحرير ومعالجة النصوص' },
    { name: 'expand', description: 'تحويل علامات التبويب إلى مسافات', example: 'expand file.txt', category: 'تحرير ومعالجة النصوص' },
    { name: 'unexpand', description: 'تحويل المسافات إلى علامات تبويب', example: 'unexpand file.txt', category: 'تحرير ومعالجة النصوص' },
  
    // System Control and Boot
    { name: 'grub-install', description: 'تثبيت GRUB على جهاز', example: 'sudo grub-install /dev/sda', category: 'التحكم بالنظام والإقلاع' },
    { name: 'update-grub', description: 'تحديث تكوين GRUB', example: 'sudo update-grub', category: 'التحكم بالنظام والإقلاع' },
  
    // User Environment
    { name: 'chsh', description: 'تغيير shell المستخدم', example: 'chsh -s /bin/zsh', category: 'بيئة المستخدم' },
    { name: 'env', description: 'عرض متغيرات البيئة', example: 'env', category: 'بيئة المستخدم' },
  
    // Disk Usage and Quota
    { name: 'quota', description: 'عرض حصص استخدام القرص', example: 'quota -v', category: 'استخدام القرص والحصص' },
    { name: 'edquota', description: 'تحرير حصص المستخدم أو المجموعة', example: 'sudo edquota username', category: 'استخدام القرص والحصص' },
  
    // System Logging
    { name: 'logger', description: 'إضافة إدخالات إلى سجل النظام', example: 'logger "Custom log message"', category: 'سجلات النظام' },
    { name: 'logrotate', description: 'إدارة وتدوير ملفات السجل', example: 'sudo logrotate /etc/logrotate.conf', category: 'سجلات النظام' },
  
    // Advanced Networking
    { name: 'ethtool', description: 'عرض أو تغيير إعدادات واجهة الشبكة', example: 'sudo ethtool eth0', category: 'الشبكات المتقدمة' },
    { name: 'ss', description: 'أداة تحليل المقابس (بديل لـ netstat)', example: 'ss -tuln', category: 'الشبكات المتقدمة' },
    { name: 'arp', description: 'عرض وتعديل جدول ARP للنظام', example: 'arp -e', category: 'الشبكات المتقدمة' },
  
    // Performance Monitoring
    { name: 'stress', description: 'فرض حمل على النظام لاختبار الأداء', example: 'stress --cpu 4 --timeout 60s', category: 'مراقبة الأداء' },
    { name: 'sysbench', description: 'معيار قياس أداء النظام', example: 'sysbench cpu run', category: 'مراقبة الأداء' },
  
    // Version Control (additional Git commands)
    { name: 'git log', description: 'عرض سجل الالتزامات', example: 'git log --oneline', category: 'إدارة الإصدارات' },
    { name: 'git diff', description: 'عرض التغييرات بين الالتزامات أو الفروع', example: 'git diff HEAD~1 HEAD', category: 'إدارة الإصدارات' }
  
];

const categories = [...new Set(commands.map(cmd => cmd.category))];

const CommandCard = ({ command }) => (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
    <h3 className="text-xl font-bold mb-2 text-blue-600">{command.name}</h3>
    <p className="mb-2 text-gray-700">{command.description}</p>
    <p className="bg-gray-100 p-2 rounded mb-2 text-sm font-mono">{command.example}</p>
    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
      {command.category}
    </span>
  </div>
);

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('commands');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCommands = useMemo(() => {
    return commands.filter(command =>
      (activeCategory === 'all' || command.category === activeCategory) &&
      (command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       command.description.includes(searchTerm) ||
       command.category.includes(searchTerm))
    );
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">أهم 100 أمر في لينكس للمبتدئين</h1>
      
      <div className="flex justify-center mb-8 bg-white rounded-lg shadow-md">
        <button
          className={`px-4 py-2 rounded-l-lg ${activeTab === 'commands' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('commands')}
        >
          <BookOpen className="inline-block ml-2" size={18} />
          الأوامر
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'terminal' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('terminal')}
        >
          <Terminal className="inline-block ml-2" size={18} />
          المحاكي
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${activeTab === 'quiz' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('quiz')}
        >
          <Brain className="inline-block ml-2" size={18} />
          اختبار المعرفة
        </button>
      </div>

      {activeTab === 'commands' && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="w-full md:w-1/2 mb-4 md:mb-0 relative">
              <input
                type="text"
                placeholder="ابحث عن أمر..."
                className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="all">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommands.map((command, index) => (
              <CommandCard key={index} command={command} />
            ))}
          </div>

          {filteredCommands.length === 0 && (
            <p className="text-center text-gray-600 mt-8">لا توجد نتائج مطابقة للبحث.</p>
          )}
        </>
      )}

      {activeTab === 'terminal' && <TerminalSimulator commands={commands} />}
      {activeTab === 'quiz' && <KnowledgeTest commands={commands} />}
    </div>
  );
};

export default App;