using System;

namespace DllBest {

	public interface IRedundant<T,N> : ITree<T,N,IRedundant<T,N>>
		where N : INode<T,N> {
	}
}

