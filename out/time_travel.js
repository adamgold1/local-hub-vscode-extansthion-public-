"use strict";
"";
";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
LOCALHUB;
TIME;
TRAVEL;
SUITE;
Ultimate;
time - based;
visualization;
and;
analysis;
tools.
    Features;
1.;
TIME;
MACHINE;
Travel;
through;
project;
history;
2.;
CODE;
REPLAY;
Playback;
coding;
sessions;
3.;
BRANCH;
TREE;
Visual;
branch;
management;
Author: Your;
котёнок;
Version: COSMIC;
"";
";
var os = ;
var re = ;
var json = ;
var time = ;
var difflib = ;
const module_1 = __importDefault(require());
from;
dataclasses;
const module_2 = __importDefault(require());
from;
module_3.default;
const module_3 = __importDefault(require());
from;
collections;
const module_4 = __importDefault(require());
var ;
(function () {
})( || ( = {}));
var threading = #;
#;
COMMON;
DATA;
STRUCTURES;
#;
let TimePoint = (() => {
    let _classDecorators = [module_2.default];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var TimePoint = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TimePoint = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return TimePoint = _classThis;
})();
"";
"A point in time with associated data.";
"";
timestamp: float;
readable: str;
files: List[str];
groups: List[int];
snapshot_count: int;
def;
to_dict(self) -  > module_1.default[str, Any];
return {
    "timestamp": self.timestamp,
    "readable": self.readable,
    "files": self.files,
    "groups": self.groups,
    "snapshot_count": self.snapshot_count
};
let FileState = (() => {
    let _classDecorators = [module_2.default];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FileState = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FileState = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return FileState = _classThis;
})();
"";
"State of a file at a specific time.";
"";
path: str;
version: int;
content: str;
content_hash: str;
size: int;
exists: bool;
def;
to_dict(self) -  > module_1.default[str, Any];
return {
    "path": self.path,
    "version": self.version,
    "content": self.content,
    "content_hash": self.content_hash,
    "size": self.size,
    "exists": self.exists
};
let ReplayFrame = (() => {
    let _classDecorators = [module_2.default];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReplayFrame = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReplayFrame = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return ReplayFrame = _classThis;
})();
"";
"Single frame in code replay.";
"";
timestamp: float;
readable: str;
file_path: str;
action: str;
#;
'create', 'modify', 'delete';
content: str;
diff_from_prev: Optional[str];
cursor_position: Optional[int];
changed_lines: List[int];
def;
to_dict(self) -  > module_1.default[str, Any];
return {
    "timestamp": self.timestamp,
    "readable": self.readable,
    "file_path": self.file_path,
    "action": self.action,
    "content": self.content,
    "diff_from_prev": self.diff_from_prev,
    "cursor_position": self.cursor_position,
    "changed_lines": self.changed_lines
};
let BranchNode = (() => {
    let _classDecorators = [module_2.default];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BranchNode = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BranchNode = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return BranchNode = _classThis;
})();
"";
"Node in branch tree.";
"";
id: int;
name: str;
created_at: float;
is_active: bool;
parent_id: Optional[int];
children: List['BranchNode'] = field(default_factory = list);
merged_into: Optional[int] = None;
merged_at: Optional[float] = None;
commit_count: int = 0;
file_count: int = 0;
description: str = "";
def;
to_dict(self) -  > module_1.default[str, Any];
return {
    "id": self.id,
    "name": self.name,
    "created_at": self.created_at,
    "created_at_readable": module_3.default.fromtimestamp(self.created_at).strftime("%Y-%m-%d %H:%M"),
    "is_active": self.is_active,
    "parent_id": self.parent_id,
    "children": [c.to_dict()], for: c in self.children,
    "merged_into": self.merged_into,
    "merged_at": self.merged_at,
    "commit_count": self.commit_count,
    "file_count": self.file_count,
    "description": self.description
};
#;
#;
TIME;
MACHINE;
#;
class TimeMachine {
}
"";
";
Travel;
through;
project;
history.
;
See;
the;
state;
of;
ALL;
files;
at;
any;
point in time.
;
"";
";
def;
__init__(self, hub);
self.hub = hub;
self._cache = {};
self._cache_lock = threading.Lock();
def;
get_timeline(self, session, str = "vscode", days, int = 30, resolution, str = "hour", #, 'minute', 'hour', 'day') -  > module_1.default[str, Any];
"";
";
Get;
timeline;
of;
project;
changes.
    Args;
session: Session;
identifier;
days: Number;
of;
days;
to;
analyze;
resolution: Time;
resolution;
Returns: Timeline;
with (time)
    points;
"";
";
cutoff = time.time() - (days * 86400);
#;
Resolution in seconds;
resolutions = {
    'minute': 60,
    'hour': 3600,
    'day': 86400
};
bucket_size = resolutions.get(resolution, 3600);
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
all;
snapshots in range;
cur.execute("", ", SELECT, id, original_path, version, created_at, tm_group_id, CAST(created_at /  ? AS : , INTEGER), FROM, snapshots, WHERE, session =  ? AND : , created_at >=  ?
    ORDER : , BY, created_at, ASC, "", ", (bucket_size, session, cutoff)), snapshots = cur.fetchall(), #, Group, by, time, bucket, buckets, module_1.default[int, module_1.default] = (0, module_4.default)(lambda, {
    "timestamp": 0,
    "files": set(),
    "groups": set(),
    "snapshot_count": 0
}));
for (snap in snapshots)
    : bucket = snap[5];
buckets[bucket]["timestamp"] = max(buckets[bucket]["timestamp"], snap[3], or, 0);
buckets[bucket]["files"].add(snap[1]);
if (snap[4])
    : buckets[bucket]["groups"].add(snap[4]);
buckets[bucket]["snapshot_count"] += 1;
#;
Convert;
to;
TimePoints;
time_points = [];
for (bucket_id in sorted(buckets.keys()))
    : data = buckets[bucket_id];
tp = TimePoint(timestamp = data["timestamp"], readable = module_3.default.fromtimestamp(data["timestamp"]).strftime("%Y-%m-%d %H:%M"), files = list(data["files"]), groups = list(data["groups"]), snapshot_count = data["snapshot_count"]);
time_points.append(tp);
#;
Calculate;
summary;
all_files = set();
all_groups = set();
total_snapshots = 0;
for (tp in time_points)
    : all_files.update(tp.files);
all_groups.update(tp.groups);
total_snapshots += tp.snapshot_count;
return {
    "ok": True,
    "timeline": [tp.to_dict()], for: tp in time_points,
    "summary": {
        "total_points": len(time_points),
        "total_files": len(all_files),
        "total_groups": len(all_groups),
        "total_snapshots": total_snapshots,
        "time_range": {
            "start": time_points[0].timestamp, if: time_points, else: 0,
            "end": time_points[-1].timestamp, if: time_points, else: 0
        }
    },
    "resolution": resolution,
    "days": days
};
except;
Exception;
();
return { "ok": False, "error": str(e), "timeline": [] };
def;
get_project_state_at(self, timestamp, float, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Get;
the;
state;
of;
ALL;
files;
at;
a;
specific;
timestamp.
    Args;
timestamp: Unix;
timestamp;
session: Session;
identifier;
Returns: Complete;
project;
state;
at;
that;
time;
"";
";
cache_key = f;
"{session}:{int(timestamp)}";
with (self._cache_lock)
    : if (cache_key in self._cache)
        : return self._cache[cache_key];
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
latest;
version;
of;
each;
file;
at;
or;
before;
timestamp;
cur.execute("", ", SELECT, original_path, MAX(version), FROM, snapshots, WHERE, session =  ? AND : , created_at <=  ?
    GROUP : , BY, original_path, "", ", (session, timestamp)), file_versions = { row, [0]: row[1], for: row in cur.fetchall() }, #, Get, details);
for (each; file; files = [])
    for (path, version in file_versions.items())
        : cur.execute("", ", SELECT, content_hash, file_size, backup_relpath, created_at, reason, FROM, snapshots, WHERE, session =  ? AND : , original_path =  ? AND : , version =  ?
            "" : , ", (session, path, version)), row = cur.fetchone());
if (row)
    : content = self._read_blob(row[2]);
files.append({
    "path": path,
    "filename": os.path.basename(path),
    "version": version,
    "content_hash": row[0], or, "": ,
    "size": row[1], or, 0: ,
    "content": content, or, "": ,
    "last_modified": row[3], or, 0: ,
    "last_reason": row[4], or, "": 
});
#;
Get;
groups;
at;
this;
time;
cur.execute("", ", SELECT, id, name, confirmed_at, file_count, FROM, groups, WHERE, session =  ? AND : , created_at <=  ?
    ORDER : , BY, created_at, DESC, LIMIT, 20, "", ", (session, timestamp)), groups = [{
        "id": row[0],
        "name": row[1],
        "confirmed_at": row[2],
        "file_count": row[3]
    }]);
for (row in cur.fetchall())
    ;
#;
Sort;
files;
by;
path;
files.sort(key = lambda, f, f["path"]);
result = {
    "ok": True,
    "timestamp": timestamp,
    "readable": module_3.default.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S"),
    "files": files,
    "file_count": len(files),
    "groups": groups,
    "group_count": len(groups)
};
#;
Cache;
result;
with (self._cache_lock)
    : if (len(self._cache) > 100)
        : #;
Clear;
old;
cache;
entries;
self._cache.clear();
self._cache[cache_key] = result;
return result;
except;
Exception;
();
return { "ok": False, "error": str(e) };
def;
get_file_at(self, path, str, timestamp, float, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Get;
specific;
file;
content;
at;
a;
timestamp.
;
"";
";
apath = os.path.normpath(os.path.abspath(path));
if (os.name == 'nt')
    : apath = apath.lower();
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
version;
at;
or;
before;
timestamp;
cur.execute("", ", SELECT, version, content_hash, backup_relpath, created_at, reason, FROM, snapshots, WHERE, session =  ? AND : , original_path =  ? AND : , created_at <=  ?
    ORDER : , BY, version, DESC, LIMIT, 1, "", ", (session, apath, timestamp)), row = cur.fetchone());
if (not)
    row: return {
        "ok": True,
        "exists": False,
        "path": path,
        "message": "File did not exist at this time"
    };
content = self._read_blob(row[2]);
return {
    "ok": True,
    "exists": True,
    "path": path,
    "filename": os.path.basename(path),
    "version": row[0],
    "content": content, or, "": ,
    "content_hash": row[1], or, "": ,
    "created_at": row[3],
    "reason": row[4], or, "": 
};
except;
Exception;
();
return { "ok": False, "error": str(e) };
def;
compare_times(self, time_a, float, time_b, float, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Compare;
project;
state;
between;
two;
times.
;
Shows;
what;
changed.
;
"";
";
try { }
finally { }
state_a = self.get_project_state_at(time_a, session);
state_b = self.get_project_state_at(time_b, session);
if (not)
    state_a.get("ok");
or;
not;
state_b.get("ok");
return { "ok": False, "error": "Failed to get states" };
files_a = { f, ["path"]: f, for: f in state_a.get("files", []) };
files_b = { f, ["path"]: f, for: f in state_b.get("files", []) };
all_paths = set(files_a.keys()) | set(files_b.keys());
changes = {
    "added": [],
    "removed": [],
    "modified": [],
    "unchanged": []
};
for (path in all_paths)
    : in_a = path in files_a;
in_b = path in files_b;
if (not)
    in_a;
and;
in_b: changes["added"].append({
    "path": path,
    "filename": os.path.basename(path),
    "version": files_b[path]["version"],
    "size": files_b[path]["size"]
});
elif;
in_a;
and;
not;
in_b: changes["removed"].append({
    "path": path,
    "filename": os.path.basename(path),
    "version": files_a[path]["version"]
});
elif;
files_a[path]["content_hash"] != files_b[path]["content_hash"];
#;
Calculate;
diff;
size;
content_a = files_a[path]["content"];
content_b = files_b[path]["content"];
lines_a = content_a.splitlines();
lines_b = content_b.splitlines();
diff = list(difflib.unified_diff(lines_a, lines_b));
added_lines = sum(1);
for (l in diff)
    if (l.startswith('+'))
        and;
not;
l.startswith('+++');
removed_lines = sum(1);
for (l in diff)
    if (l.startswith('-'))
        and;
not;
l.startswith('---');
changes["modified"].append({
    "path": path,
    "filename": os.path.basename(path),
    "version_a": files_a[path]["version"],
    "version_b": files_b[path]["version"],
    "lines_added": added_lines,
    "lines_removed": removed_lines
});
changes["unchanged"].append({
    "path": path,
    "filename": os.path.basename(path)
});
return {
    "ok": True,
    "time_a": {
        "timestamp": time_a,
        "readable": module_3.default.fromtimestamp(time_a).strftime("%Y-%m-%d %H:%M:%S")
    },
    "time_b": {
        "timestamp": time_b,
        "readable": module_3.default.fromtimestamp(time_b).strftime("%Y-%m-%d %H:%M:%S")
    },
    "changes": changes,
    "summary": {
        "added": len(changes["added"]),
        "removed": len(changes["removed"]),
        "modified": len(changes["modified"]),
        "unchanged": len(changes["unchanged"])
    }
};
except;
Exception;
();
return { "ok": False, "error": str(e) };
def;
_read_blob(self, backup_relpath, Optional[str]) -  > Optional[str];
"";
"Read blob content.";
"";
if (not)
    backup_relpath: return None;
try { }
finally { }
if (hasattr(self.hub, 'central_backup_root'))
    and;
self.hub.central_backup_root;
full_path = os.path.join(self.hub.central_backup_root, backup_relpath);
if (os.path.exists(full_path))
    : with (open(full_path, 'r', encoding = 'utf-8', errors = 'replace'))
        : return f.read();
except;
Exception: pass;
return None;
#;
#;
CODE;
REPLAY;
#;
class CodeReplay {
}
"";
";
Replay;
coding;
sessions;
like;
a;
video.
;
See;
how;
code;
was;
written in real - time.
;
"";
";
def;
__init__(self, hub);
self.hub = hub;
def;
get_session_replay(self, session, str = "vscode", start_time, Optional[float] = None, end_time, Optional[float] = None, file_path, Optional[str] = None, max_frames, int = 500) -  > module_1.default[str, Any];
"";
";
Get;
replay;
data;
for (a; coding; session.
    Args)
    : session: Session;
identifier;
start_time: Start;
timestamp(24, hours, ago);
end_time: End;
timestamp(now);
file_path: Optional;
filter;
for (specific; file; max_frames)
    : Maximum;
frames;
to;
return;
Returns: Replay;
data;
with (frames)
    "";
";
if (end_time)
    is;
None: end_time = time.time();
if (start_time)
    is;
None: start_time = end_time - 86400;
#;
24;
hours;
ago;
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Build;
query;
query = "";
";
SELECT;
id,
    original_path,
    version,
    backup_relpath,
    created_at,
    reason,
    content_hash;
FROM;
snapshots;
WHERE;
session =  ?
    AND : ;
created_at >=  ?
    AND : ;
created_at <=  ?
    "" : ;
";
params = [session, start_time, end_time];
if (file_path)
    : apath = os.path.normpath(os.path.abspath(file_path));
if (os.name == 'nt')
    : apath = apath.lower();
query += " AND original_path = ?";
params.append(apath);
query += " ORDER BY created_at ASC LIMIT ?";
params.append(max_frames * 2);
#;
Get;
extra;
for (dedup; cur.execute(query, params); snapshots = cur.fetchall())
    #;
Build;
frames;
frames = [];
prev_content: module_1.default[str, str] = {};
#;
path -  > content;
for (snap in snapshots)
    : path = snap[1];
version = snap[2];
backup_path = snap[3];
created_at = snap[4];
reason = snap[5];
content_hash = snap[6];
#;
Read;
content;
content = self._read_blob(backup_path);
or;
"";
#;
Determine;
action;
if (path)
    not in prev_content;
action = "create";
elif;
not;
content;
and;
prev_content[path];
action = "delete";
action = "modify";
#;
Calculate;
diff;
from;
previous;
diff_text = None;
changed_lines = [];
if (path in prev_content)
    : old_lines = prev_content[path].splitlines();
new_lines = content.splitlines();
diff = list(difflib.unified_diff(old_lines, new_lines, lineterm = '', n = 0));
if (len(diff) > 2)
    : diff_text = '\n'.join(diff);
#;
Find;
changed;
line;
numbers;
for (i, line in enumerate(diff))
    : if (line.startswith('@@'))
        : match = re.search(r, '\+(\d+)', line);
if (match)
    : changed_lines.append(int(match.group(1)));
#;
Estimate;
cursor;
position(last, changed, line);
cursor_pos = changed_lines[-1];
if (changed_lines)
    ;
else
    None;
frame = ReplayFrame(timestamp = created_at, readable = module_3.default.fromtimestamp(created_at).strftime("%H:%M:%S"), file_path = path, action = action, content = content, diff_from_prev = diff_text, cursor_position = cursor_pos, changed_lines = changed_lines);
frames.append(frame);
#;
Update;
prev;
content;
prev_content[path] = content;
if (len(frames) >= max_frames)
    : break;
#;
Calculate;
session;
stats;
files_touched = set(f.file_path);
for (f in frames)
    total_changes = sum(1);
for (f in frames)
    if (f.action == "modify")
        return {
            "ok": True,
            "frames": [f.to_dict()], for: f in frames,
            "frame_count": len(frames),
            "time_range": {
                "start": frames[0].timestamp, if: frames, else: start_time,
                "end": frames[-1].timestamp, if: frames, else: end_time,
                "duration_seconds": (frames[-1].timestamp - frames[0].timestamp), if: len(frames) > 1, else: 0
            },
            "stats": {
                "files_touched": len(files_touched),
                "total_changes": total_changes,
                "creates": sum(1), for: f in frames, if: f.action == "create",
                "modifies": sum(1), for: f in frames, if: f.action == "modify",
                "deletes": sum(1), for: f in frames, if: f.action == "delete"
            },
            "files": list(files_touched)
        };
except;
Exception;
();
return { "ok": False, "error": str(e), "frames": [] };
def;
get_file_replay(self, path, str, session, str = "vscode", max_frames, int = 200) -  > module_1.default[str, Any];
"";
";
Get;
replay;
for (a; specific; file.
)
    Shows;
the;
evolution;
of;
the;
file;
over;
time.
;
"";
";
apath = os.path.normpath(os.path.abspath(path));
if (os.name == 'nt')
    : apath = apath.lower();
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
cur.execute("", ", SELECT, id, version, backup_relpath, created_at, reason, content_hash, file_size, FROM, snapshots, WHERE, session =  ? AND : , original_path =  ?
    ORDER : , BY, version, ASC, LIMIT ?
    "" : , ", (session, apath, max_frames)), snapshots = cur.fetchall());
if (not)
    snapshots: return {
        "ok": True,
        "path": path,
        "frames": [],
        "message": "No history found for this file"
    };
frames = [];
prev_content = "";
for (snap in snapshots)
    : version = snap[1];
backup_path = snap[2];
created_at = snap[3];
reason = snap[4];
content_hash = snap[5];
file_size = snap[6];
content = self._read_blob(backup_path);
or;
"";
#;
Determine;
action;
if (version == 1)
    : action = "create";
elif;
not;
content;
and;
prev_content: action = "delete";
action = "modify";
#;
Calculate;
diff;
diff_text = None;
changed_lines = [];
lines_added = 0;
lines_removed = 0;
if (prev_content)
    : old_lines = prev_content.splitlines();
new_lines = content.splitlines();
diff = list(difflib.unified_diff(old_lines, new_lines, lineterm = ''));
if (len(diff) > 2)
    : diff_text = '\n'.join(diff);
lines_added = sum(1);
for (l in diff)
    if (l.startswith('+'))
        and;
not;
l.startswith('+++');
lines_removed = sum(1);
for (l in diff)
    if (l.startswith('-'))
        and;
not;
l.startswith('---');
#;
Parse;
changed;
line;
numbers;
for (line in diff)
    : if (line.startswith('@@'))
        : match = re.search(r, '\+(\d+)(?:,(\d+))?', line);
if (match)
    : start = int(match.group(1));
count = int(match.group(2), or, 1);
changed_lines.extend(range(start, start + count));
frames.append({
    "version": version,
    "timestamp": created_at,
    "readable": module_3.default.fromtimestamp(created_at).strftime("%Y-%m-%d %H:%M:%S"),
    "action": action,
    "reason": reason, or, "": ,
    "content": content,
    "content_hash": content_hash, or, "": ,
    "size": file_size, or, len(content) { },
    "line_count": len(content.splitlines()),
    "diff": diff_text,
    "lines_added": lines_added,
    "lines_removed": lines_removed,
    "changed_lines": changed_lines[], 50: , #: Limit
});
prev_content = content;
return {
    "ok": True,
    "path": path,
    "filename": os.path.basename(path),
    "frames": frames,
    "frame_count": len(frames),
    "time_range": {
        "first": frames[0]["timestamp"],
        "last": frames[-1]["timestamp"],
        "duration_seconds": frames[-1]["timestamp"] - frames[0]["timestamp"]
    },
    "stats": {
        "total_versions": len(frames),
        "total_lines_added": sum(f["lines_added"]), for: f in frames,
        "total_lines_removed": sum(f["lines_removed"]), for: f in frames,
        "final_line_count": frames[-1]["line_count"], if: frames, else: 0
    }
};
except;
Exception;
();
return { "ok": False, "error": str(e), "frames": [] };
def;
get_typing_simulation(self, path, str, from_version, int, to_version, int, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Get;
character - by - character;
typing;
simulation;
between;
two;
versions.
;
For;
smooth;
replay;
animation.
;
"";
";
apath = os.path.normpath(os.path.abspath(path));
if (os.name == 'nt')
    : apath = apath.lower();
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
both;
versions;
cur.execute("", ", SELECT, version, backup_relpath, created_at, FROM, snapshots, WHERE, session =  ? AND : , original_path =  ? AND : , version, IN(), "", ", (session, apath, from_version, to_version)), rows = { row, [0]: row, for: row in cur.fetchall() });
if (from_version)
    not in rows;
or;
to_version;
not in rows;
return { "ok": False, "error": "Version not found" };
content_from = self._read_blob(rows[from_version][1]);
or;
"";
content_to = self._read_blob(rows[to_version][1]);
or;
"";
#;
Generate;
typing;
steps;
steps = self._generate_typing_steps(content_from, content_to);
return {
    "ok": True,
    "path": path,
    "from_version": from_version,
    "to_version": to_version,
    "steps": steps,
    "step_count": len(steps),
    "from_length": len(content_from),
    "to_length": len(content_to)
};
except;
Exception;
();
return { "ok": False, "error": str(e) };
def;
_generate_typing_steps(self, from_content, str, to_content, str) -  > List[module_1.default[str, Any]];
"";
"Generate typing simulation steps.";
"";
steps = [];
#;
Use;
difflib;
to;
find;
changes;
matcher = difflib.SequenceMatcher(None, from_content, to_content);
current_content = from_content;
offset = 0;
for (tag, i1, i2, j1, j2 in matcher.get_opcodes())
    : if (tag == 'equal')
        : continue;
elif;
tag == 'delete';
#;
Character;
deletion;
for (k in range(i2 - 1, i1 - 1, -1))
    : pos = k + offset;
char = current_content[pos];
if (pos < len(current_content))
    ;
else
    '';
steps.append({
    "type": "delete",
    "position": pos,
    "char": char,
    "content_after": current_content[], pos
} + current_content[pos + 1]);
current_content = current_content[];
pos;
+current_content[pos + 1];
offset -= (i2 - i1);
elif;
tag == 'insert';
#;
Character;
insertion;
insert_text = to_content[j1];
j2;
for (k, char in enumerate(insert_text))
    : pos = i1 + offset + k;
steps.append({
    "type": "insert",
    "position": pos,
    "char": char,
    "content_after": current_content[], pos
} + char + current_content[pos]);
current_content = current_content[];
pos;
+char + current_content[pos];
offset += (j2 - j1);
elif;
tag == 'replace';
#;
Delete;
then;
insert;
for (k in range(i2 - 1, i1 - 1, -1))
    : pos = k + offset;
if (pos < len(current_content))
    : steps.append({
        "type": "delete",
        "position": pos,
        "char": current_content[pos],
        "content_after": current_content[], pos
    } + current_content[pos + 1]);
current_content = current_content[];
pos;
+current_content[pos + 1];
insert_text = to_content[j1];
j2;
for (k, char in enumerate(insert_text))
    : pos = i1 + offset + k - (i2 - i1);
steps.append({
    "type": "insert",
    "position": pos,
    "char": char,
    "content_after": current_content[], pos
} + char + current_content[pos]);
current_content = current_content[];
pos;
+char + current_content[pos];
offset += (j2 - j1) - (i2 - i1);
#;
Limit;
steps;
to;
prevent;
performance;
issues;
if (len(steps) > 1000)
    : #;
Compress: take;
every;
Nth;
step;
n = len(steps); // 500
steps = steps[];
n;
return steps;
def;
_read_blob(self, backup_relpath, Optional[str]) -  > Optional[str];
"";
"Read blob content.";
"";
if (not)
    backup_relpath: return None;
try { }
finally { }
if (hasattr(self.hub, 'central_backup_root'))
    and;
self.hub.central_backup_root;
full_path = os.path.join(self.hub.central_backup_root, backup_relpath);
if (os.path.exists(full_path))
    : with (open(full_path, 'r', encoding = 'utf-8', errors = 'replace'))
        : return f.read();
except;
Exception: pass;
return None;
#;
#;
BRANCH;
TREE;
#;
class BranchTree {
}
"";
";
Visual;
branch;
management.
;
See;
branch;
hierarchy, merges, and;
history.
;
"";
";
def;
__init__(self, hub);
self.hub = hub;
def;
get_branch_tree(self, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Get;
complete;
branch;
tree;
structure.
;
"";
";
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
all;
branches;
cur.execute("", ", SELECT, id, name, created_at, is_active, init_group_id, description, merged_into, merged_at, FROM, branches, WHERE, session =  ?
    ORDER : , BY, created_at, ASC, "", ", (session,)), branches_raw = cur.fetchall(), #, Get, commit, counts);
for (each; branch; branch_stats = {})
    for (branch in branches_raw)
        : bid = branch[0];
#;
Count;
groups(commits) in this;
branch;
cur.execute("", ", SELECT, COUNT(DISTINCT, g.id), COUNT(DISTINCT, s.original_path), FROM, groups, g, LEFT, JOIN, snapshots, s, ON, s.tm_group_id = g.id, WHERE, g.branch_id =  ? AND : , g.confirmed_at, IS, NOT, NULL, "", ", (bid,)), row = cur.fetchone(), branch_stats[bid] = {
    "commit_count": row[0], if: row, else: 0,
    "file_count": row[1], if: row, else: 0
}, #, Build, tree, structure, nodes, module_1.default[int, BranchNode] = {}, root_nodes, List[BranchNode] = []);
for (branch in branches_raw)
    : bid = branch[0];
#;
Find;
parent;
branch(branch, where, init_group, is);
parent_id = None;
init_group_id = branch[4];
if (init_group_id)
    : with (self.hub._db_lock)
        : cur = self.hub.conn.cursor();
cur.execute("", ", SELECT, branch_id, FROM, groups, WHERE, id =  ? AND : , is_branch_init = 1, "", ", (init_group_id,)), row = cur.fetchone());
if (row)
    : parent_id = row[0];
node = BranchNode(id = bid, name = branch[1], or, f, "branch-{bid}", created_at = branch[2], or, 0, is_active = bool(branch[3]), parent_id = parent_id, description = branch[5], or, "", merged_into = branch[6], merged_at = branch[7], commit_count = branch_stats.get(bid, {}).get("commit_count", 0), file_count = branch_stats.get(bid, {}).get("file_count", 0));
nodes[bid] = node;
#;
Link;
parents;
and;
children;
for (node in nodes.values())
    : if (node.parent_id)
        and;
node.parent_id in nodes;
nodes[node.parent_id].children.append(node);
root_nodes.append(node);
#;
Get;
current;
active;
branch;
active_branch = next((n));
for (n in nodes.values())
    if (n.is_active)
        , None;
return {
    "ok": True,
    "tree": [n.to_dict()], for: n in root_nodes,
    "all_branches": [n.to_dict()], for: n in nodes.values(),
    "branch_count": len(nodes),
    "active_branch": active_branch.to_dict(), if: active_branch, else: None
};
except;
Exception;
();
return { "ok": False, "error": str(e), "tree": [] };
def;
get_branch_history(self, branch_id, int, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Get;
detailed;
history;
for (a; specific; branch.
)
    "";
";
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
branch;
info;
cur.execute("", ", SELECT, name, created_at, is_active, description, merged_into, FROM, branches, WHERE, id =  ? AND : , session =  ?
    "" : , ", (branch_id, session)), branch = cur.fetchone());
if (not)
    branch: return { "ok": False, "error": "Branch not found" };
#;
Get;
commits(groups) in this;
branch;
cur.execute("", ", SELECT, g.id, g.name, g.created_at, g.confirmed_at, g.file_count, g.tags, FROM, groups, g, WHERE, g.branch_id =  ? AND : , g.confirmed_at, IS, NOT, NULL, ORDER, BY, g.confirmed_at, DESC, LIMIT, 100, "", ", (branch_id,)), commits = []);
for (row in cur.fetchall())
    : tags = [];
if (row[5])
    : try { }
    finally { }
tags = json.loads(row[5]);
except: pass;
commits.append({
    "id": row[0],
    "name": row[1],
    "created_at": row[2],
    "confirmed_at": row[3],
    "file_count": row[4],
    "tags": tags
});
#;
Get;
files;
changed in this;
branch;
cur.execute("", ", SELECT, DISTINCT, s.original_path, COUNT( * ), FROM, snapshots, s, JOIN, groups, g, ON, s.tm_group_id = g.id, WHERE, g.branch_id =  ?
    GROUP : , BY, s.original_path, ORDER, BY, changes, DESC, LIMIT, 50, "", ", (branch_id,)), files = [{
        "path": row[0],
        "filename": os.path.basename(row[0]),
        "changes": row[1]
    }]);
for (row in cur.fetchall())
    ;
return {
    "ok": True,
    "branch": {
        "id": branch_id,
        "name": branch[0],
        "created_at": branch[1],
        "is_active": bool(branch[2]),
        "description": branch[3], or, "": ,
        "merged_into": branch[4]
    },
    "commits": commits,
    "commit_count": len(commits),
    "files": files,
    "file_count": len(files)
};
except;
Exception;
();
return { "ok": False, "error": str(e) };
def;
get_branch_diff(self, branch_a, int, branch_b, int, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Compare;
two;
branches - show;
what;
's different.;
"";
";
try { }
finally { }
with (self.hub._db_lock)
    : cur = self.hub.conn.cursor();
#;
Get;
files in branch;
A;
cur.execute("", ", SELECT, DISTINCT, s.original_path, s.content_hash, MAX(s.version), FROM, snapshots, s, JOIN, groups, g, ON, s.tm_group_id = g.id, WHERE, g.branch_id =  ?
    GROUP : , BY, s.original_path, "", ", (branch_a,)), files_a = { row, [0]: { "hash": row[1], "version": row[2] }, for: row in cur.fetchall() }, #, Get, files in branch, B, cur.execute("", ", SELECT, DISTINCT, s.original_path, s.content_hash, MAX(s.version), FROM, snapshots, s, JOIN, groups, g, ON, s.tm_group_id = g.id, WHERE, g.branch_id =  ?
    GROUP : , BY, s.original_path, "", ", (branch_b,)), files_b = { row, [0]: { "hash": row[1], "version": row[2] }, for: row in cur.fetchall() }, all_paths = set(files_a.keys()) | set(files_b.keys()), diff = {
    "only_in_a": [],
    "only_in_b": [],
    "different": [],
    "same": []
}));
for (path in all_paths)
    : in_a = path in files_a;
in_b = path in files_b;
if (in_a)
    and;
not;
in_b: diff["only_in_a"].append({
    "path": path,
    "filename": os.path.basename(path),
    "version": files_a[path]["version"]
});
elif;
in_b;
and;
not;
in_a: diff["only_in_b"].append({
    "path": path,
    "filename": os.path.basename(path),
    "version": files_b[path]["version"]
});
elif;
files_a[path]["hash"] != files_b[path]["hash"];
diff["different"].append({
    "path": path,
    "filename": os.path.basename(path),
    "version_a": files_a[path]["version"],
    "version_b": files_b[path]["version"]
});
diff["same"].append({
    "path": path,
    "filename": os.path.basename(path)
});
return {
    "ok": True,
    "branch_a": branch_a,
    "branch_b": branch_b,
    "diff": diff,
    "summary": {
        "only_in_a": len(diff["only_in_a"]),
        "only_in_b": len(diff["only_in_b"]),
        "different": len(diff["different"]),
        "same": len(diff["same"])
    }
};
except;
Exception;
();
return { "ok": False, "error": str(e) };
def;
get_merge_preview(self, source_branch, int, target_branch, int, session, str = "vscode") -  > module_1.default[str, Any];
"";
";
Preview;
what;
would;
happen;
if (branches)
    were;
merged.
;
"";
";
diff = self.get_branch_diff(source_branch, target_branch, session);
if (not)
    diff.get("ok");
return diff;
#;
Analyze;
potential;
conflicts;
conflicts = [];
auto_merge = [];
for (file in diff["diff"]["different"])
    : #;
Simple;
conflict;
detection: if (same)
    file;
is;
different, potential;
conflict;
conflicts.append({
    "path": file["path"],
    "filename": file["filename"],
    "source_version": file["version_a"],
    "target_version": file["version_b"],
    "resolution": "manual"
});
#;
Files;
only in source;
can;
be;
auto - merged;
for (file in diff["diff"]["only_in_a"])
    : auto_merge.append({
        "path": file["path"],
        "filename": file["filename"],
        "action": "add"
    });
return {
    "ok": True,
    "source_branch": source_branch,
    "target_branch": target_branch,
    "can_auto_merge": len(conflicts) == 0,
    "conflicts": conflicts,
    "auto_merge": auto_merge,
    "summary": {
        "conflicts": len(conflicts),
        "auto_merge": len(auto_merge),
        "unchanged": len(diff["diff"]["same"])
    }
};
#;
#;
TIME;
TRAVEL;
ENGINE;
#;
class TimeTravelEngine {
}
"";
";
Main;
engine;
combining;
all;
time;
travel;
features.
;
"";
";
def;
__init__(self, hub);
self.hub = hub;
self.time_machine = TimeMachine(hub);
self.code_replay = CodeReplay(hub);
self.branch_tree = BranchTree(hub);
#;
Delegate;
methods;
def;
get_timeline(self,  * args,  ** kwargs);
return self.time_machine.get_timeline( * args,  ** kwargs);
def;
get_project_state_at(self,  * args,  ** kwargs);
return self.time_machine.get_project_state_at( * args,  ** kwargs);
def;
get_file_at(self,  * args,  ** kwargs);
return self.time_machine.get_file_at( * args,  ** kwargs);
def;
compare_times(self,  * args,  ** kwargs);
return self.time_machine.compare_times( * args,  ** kwargs);
def;
get_session_replay(self,  * args,  ** kwargs);
return self.code_replay.get_session_replay( * args,  ** kwargs);
def;
get_file_replay(self,  * args,  ** kwargs);
return self.code_replay.get_file_replay( * args,  ** kwargs);
def;
get_typing_simulation(self,  * args,  ** kwargs);
return self.code_replay.get_typing_simulation( * args,  ** kwargs);
def;
get_branch_tree(self,  * args,  ** kwargs);
return self.branch_tree.get_branch_tree( * args,  ** kwargs);
def;
get_branch_history(self,  * args,  ** kwargs);
return self.branch_tree.get_branch_history( * args,  ** kwargs);
def;
get_branch_diff(self,  * args,  ** kwargs);
return self.branch_tree.get_branch_diff( * args,  ** kwargs);
def;
get_merge_preview(self,  * args,  ** kwargs);
return self.branch_tree.get_merge_preview( * args,  ** kwargs);
#;
#;
ROUTE;
REGISTRATION;
#;
def;
register_time_travel_routes(app, registry);
"";
";
Register;
all;
time;
travel;
routes;
with (FastAPI.
)
    "";
";
from;
fastapi;
FQuery, Request;
from;
typing;
var Optional = _static_hub;
registry;
if (hasattr(registry, 'conn'))
    ;
else
    None;
_engine = None;
def;
_get_engine(request, Request) -  > TimeTravelEngine;
nonlocal;
_engine;
hub = _static_hub;
if (_static_hub)
    ;
else
    request.state.hub;
if (_engine)
    is;
None: _engine = TimeTravelEngine(hub);
return _engine;
#;
#;
TIME;
MACHINE;
ROUTES;
#;
def;
get_timeline(request, Request, days, int = FQuery(30), resolution, str = FQuery("hour"), session, str = FQuery("vscode"));
"";
"Get project timeline.";
"";
engine = _get_engine(request);
return engine.get_timeline(session, days, resolution);
def;
get_state_at(request, Request, timestamp, float = FQuery(...), session, str = FQuery("vscode"));
"";
"Get project state at timestamp.";
"";
engine = _get_engine(request);
return engine.get_project_state_at(timestamp, session);
def;
get_file_at(request, Request, path, str = FQuery(...), timestamp, float = FQuery(...), session, str = FQuery("vscode"));
"";
"Get file at timestamp.";
"";
engine = _get_engine(request);
return engine.get_file_at(path, timestamp, session);
def;
compare_times(request, Request, time_a, float = FQuery(...), time_b, float = FQuery(...), session, str = FQuery("vscode"));
"";
"Compare project state between two times.";
"";
engine = _get_engine(request);
return engine.compare_times(time_a, time_b, session);
#;
#;
CODE;
REPLAY;
ROUTES;
#;
def;
get_session_replay(request, Request, start_time, Optional[float] = FQuery(None), end_time, Optional[float] = FQuery(None), file_path, Optional[str] = FQuery(None), max_frames, int = FQuery(500), session, str = FQuery("vscode"));
"";
"Get session replay data.";
"";
engine = _get_engine(request);
return engine.get_session_replay(session, start_time, end_time, file_path, max_frames);
def;
get_file_replay(request, Request, path, str = FQuery(...), max_frames, int = FQuery(200), session, str = FQuery("vscode"));
"";
"Get file replay data.";
"";
engine = _get_engine(request);
return engine.get_file_replay(path, session, max_frames);
def;
get_typing_simulation(request, Request, path, str = FQuery(...), from_version, int = FQuery(...), to_version, int = FQuery(...), session, str = FQuery("vscode"));
"";
"Get typing simulation between versions.";
"";
engine = _get_engine(request);
return engine.get_typing_simulation(path, from_version, to_version, session);
#;
#;
BRANCH;
TREE;
ROUTES;
#;
def;
get_branch_tree(request, Request, session, str = FQuery("vscode"));
"";
"Get branch tree structure.";
"";
engine = _get_engine(request);
return engine.get_branch_tree(session);
def;
get_branch_history(request, Request, branch_id, int, session, str = FQuery("vscode"));
"";
"Get branch history.";
"";
engine = _get_engine(request);
return engine.get_branch_history(branch_id, session);
def;
get_branch_diff(request, Request, branch_a, int = FQuery(...), branch_b, int = FQuery(...), session, str = FQuery("vscode"));
"";
"Compare two branches.";
"";
engine = _get_engine(request);
return engine.get_branch_diff(branch_a, branch_b, session);
def;
get_merge_preview(request, Request, source, int = FQuery(...), target, int = FQuery(...), session, str = FQuery("vscode"));
"";
"Preview merge between branches.";
"";
engine = _get_engine(request);
return engine.get_merge_preview(source, target, session);
print("[TimeTravelEngine] ✓ Routes registered:");
print("  ⏳ TIME MACHINE:");
print("    - GET /time-machine/timeline");
print("    - GET /time-machine/state");
print("    - GET /time-machine/file");
print("    - GET /time-machine/compare");
print("  🎬 CODE REPLAY:");
print("    - GET /replay/session");
print("    - GET /replay/file");
print("    - GET /replay/typing");
print("  🌳 BRANCH TREE:");
print("    - GET /branches/tree");
print("    - GET /branches/{id}/history");
print("    - GET /branches/diff");
print("    - GET /branches/merge-preview");
//# sourceMappingURL=time_travel.js.map