using System;

namespace DllBest {

	public interface IUnique<T,N> : ITree<T,N,IUnique<T,N>>
		where N : INode<T,N> {
	}
}

