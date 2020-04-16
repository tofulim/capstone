function Node(data) {
  this.data = data; this.next = null;
  this.prev2=null;
}
function LinkedList() {
  var _length = 0; var _head = null;
  var _tail=null;
}

LinkedList.prototype.append = function(data) {
  var node = new Node(data);
  this._length++;
  var curr;
  if( this._head == null ) {
    this._head = node;
  }
  else {
    curr = this._head;
    while( curr.next ) {
      curr = curr.next;
    }
    curr.next = node;
    node.prev2=curr;
    node.next=null;
  }

};

LinkedList.prototype.removeAt = function(pos) {
  if( pos > -1 && pos < this._length ) {
    var curr = this._head;
    var prev, index = 0;
    if( pos === 0 ) {
      if(this._length==1) {
        list = new LinkedList(); list._length=0; return null;
      }
      else {
        this._head = curr.next;
      }
    }
    else {
      while( index++ < pos ) {
        prev = curr;
        curr = prev.next;
      }
      prev.next = curr.next;
      if(curr.next!=null) {curr.next.prev2=prev;}
    } this._length--;
    curr.next = null;
    return curr.data;
  }
  return null;
};
LinkedList.prototype.indexOf = function(data) {
  var curr = this._head, index = 0;
  while( curr ) {
    if( curr.data.VID === data ) { // ==로 바궈야하나?
      return index;
    }
    index ++; curr = curr.next;
  }
  return -1;
};
LinkedList.prototype.remove = function(data) {
  var index = this.indexOf(data);
  return this.removeAt(index);
};

LinkedList.prototype.insert = function(pos, data) {
  if( pos >= 0 && pos <= this._length ) {
    var node = new Node(data),
    curr = this._head,
    prev,
    index = 0;
    if( pos === 0 ) {
      node.next = curr;
      this._head = node;
      node.prev2=null;
    }
    else {
      while( index++ < pos ) {
        prev = curr; curr = curr.next;
      }
      node.next = curr; prev.next = node;
      node.next.prev2=prev;
    }
    this._length ++;
    return true;
  }
  return false;
};
LinkedList.prototype.isEmpty = function() {
   return this._length === 0;
 };
LinkedList.prototype.size = function() { return this._length;
};

var list = new LinkedList(); list._length=0;
